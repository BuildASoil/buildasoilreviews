// scripts/sync-okendo.js
//
// Pulls all reviews from Okendo and stores them in a local SQLite database
// (using sql.js — pure JavaScript, no compilation required).
// Run this with: npm run sync

require('dotenv').config();
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// ---------- Config ----------
const OKENDO_USER_ID = process.env.OKENDO_USER_ID;
const OKENDO_API_KEY = process.env.OKENDO_API_KEY;
const API_BASE = 'https://api.okendo.io/enterprise';
const API_VERSION = '2025-02-01';
const PAGE_SIZE = 100;

if (!OKENDO_USER_ID || !OKENDO_API_KEY) {
  console.error('❌ Missing OKENDO_USER_ID or OKENDO_API_KEY in .env file');
  process.exit(1);
}

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'reviews.db');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// ---------- Okendo API helpers ----------
function authHeader() {
  const basic = Buffer.from(`${OKENDO_USER_ID}:${OKENDO_API_KEY}`).toString('base64');
  return `Basic ${basic}`;
}

async function fetchPage(lastEvaluated) {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    orderBy: 'date desc',
  });
  if (lastEvaluated) params.set('lastEvaluated', lastEvaluated);

  const url = `${API_BASE}/reviews?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: authHeader(),
      'okendo-api-version': API_VERSION,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Okendo API error ${res.status}: ${text}`);
  }
  return res.json();
}

function normalize(r) {
  const reviewer = r.reviewer || {};
  const location = reviewer.location || {};
  const reply = r.reply || {};
  const media = Array.isArray(r.media) ? r.media : [];

  // Build location string, coerce to null if empty
  const locationParts = [
    location.city,
    location.region,
    location.country && location.country.name,
  ].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : null;

  // Coerce everything to a sql.js-safe value (string, number, or null — never undefined)
  return {
    review_id: r.reviewId || null,
    product_id: r.productId || null,
    product_name: r.productName || null,
    rating: typeof r.rating === 'number' ? r.rating : null,
    title: r.title || null,
    body: r.body || null,
    reviewer_name: reviewer.displayName || null,
    reviewer_location: locationStr,
    is_verified: reviewer.isVerified ? 1 : 0,
    is_recommended: r.isRecommended ? 1 : 0,
    is_incentivized: r.isIncentivized ? 1 : 0,
    has_media: media.length > 0 ? 1 : 0,
    media_json: media.length > 0 ? JSON.stringify(media) : null,
    reply_body: (reply && (reply.rawBody || reply.body)) || null,
    reply_date: (reply && reply.dateCreated) || null,
    date_created: r.dateCreated || null,
    raw_json: JSON.stringify(r),
    synced_at: new Date().toISOString(),
  };
}

async function sync() {
  console.log(`🚀 Starting Okendo sync at ${new Date().toISOString()}`);

  // Initialize sql.js
  const SQL = await initSqlJs();

  // Load existing DB if it exists, otherwise create new
  let db;
  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
    console.log('  loaded existing database');
  } else {
    db = new SQL.Database();
    console.log('  created new database');
  }

  // Schema
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      review_id        TEXT PRIMARY KEY,
      product_id       TEXT,
      product_name     TEXT,
      rating           INTEGER,
      title            TEXT,
      body             TEXT,
      reviewer_name    TEXT,
      reviewer_location TEXT,
      is_verified      INTEGER,
      is_recommended   INTEGER,
      is_incentivized  INTEGER,
      has_media        INTEGER,
      media_json       TEXT,
      reply_body       TEXT,
      reply_date       TEXT,
      date_created     TEXT,
      raw_json         TEXT,
      synced_at        TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_rating  ON reviews(rating);
    CREATE INDEX IF NOT EXISTS idx_reviews_date    ON reviews(date_created);
    CREATE INDEX IF NOT EXISTS idx_reviews_media   ON reviews(has_media);

    CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT, finished_at TEXT,
      reviews_fetched INTEGER, reviews_new INTEGER, reviews_updated INTEGER,
      error TEXT
    );
  `);

  // (we use db.run with positional params directly — see the loop below)

  // Resume support: if we already have some reviews and the user passes RESUME=1,
  // start from the oldest existing review's date so we keep going further back in time.
  let lastEvaluated = null;
  if (process.env.RESUME === '1') {
    const result = db.exec(
      'SELECT review_id, date_created FROM reviews WHERE date_created IS NOT NULL ORDER BY date_created ASC LIMIT 1'
    );
    if (result.length > 0 && result[0].values.length > 0) {
      const [reviewId, dateCreated] = result[0].values[0];
      lastEvaluated = JSON.stringify({
        dateCreated: dateCreated,
        reviewId: reviewId,
      });
      console.log(`  RESUME mode: continuing from oldest review (${dateCreated})`);
    }
  }

  let totalFetched = 0;
  let newCount = 0;
  let updatedCount = 0;
  let pageNum = 0;
  const startedAt = new Date().toISOString();

  try {
    while (true) {
      pageNum++;

      // Retry the API call up to 3 times on transient failures
      let data;
      let lastErr;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          data = await fetchPage(lastEvaluated);
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
          console.log(`  page ${pageNum}: fetch attempt ${attempt} failed (${e.message}). Retrying in ${attempt * 2}s...`);
          await new Promise((r) => setTimeout(r, attempt * 2000));
        }
      }
      if (lastErr) throw lastErr;

      const reviews = data.reviews || [];
      if (reviews.length === 0) break;

      db.run('BEGIN');
      let pageNew = 0;
      let pageUpd = 0;
      let pageSkip = 0;
      for (const r of reviews) {
        try {
          const row = normalize(r);
          if (!row.review_id) { pageSkip++; continue; }

          // Check if row exists (positional param, much more forgiving in sql.js)
          const existsRes = db.exec('SELECT 1 FROM reviews WHERE review_id = ?', [row.review_id]);
          const existed = existsRes.length > 0 && existsRes[0].values.length > 0;

          // Upsert using positional params
          db.run(
            `INSERT INTO reviews (
              review_id, product_id, product_name, rating, title, body,
              reviewer_name, reviewer_location, is_verified, is_recommended, is_incentivized,
              has_media, media_json, reply_body, reply_date, date_created, raw_json, synced_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(review_id) DO UPDATE SET
              rating = excluded.rating, title = excluded.title, body = excluded.body,
              reviewer_name = excluded.reviewer_name, reviewer_location = excluded.reviewer_location,
              is_verified = excluded.is_verified, is_recommended = excluded.is_recommended,
              is_incentivized = excluded.is_incentivized, has_media = excluded.has_media,
              media_json = excluded.media_json, reply_body = excluded.reply_body,
              reply_date = excluded.reply_date, raw_json = excluded.raw_json, synced_at = excluded.synced_at`,
            [
              row.review_id, row.product_id, row.product_name, row.rating, row.title, row.body,
              row.reviewer_name, row.reviewer_location, row.is_verified, row.is_recommended, row.is_incentivized,
              row.has_media, row.media_json, row.reply_body, row.reply_date, row.date_created, row.raw_json, row.synced_at,
            ]
          );

          if (existed) { updatedCount++; pageUpd++; }
          else { newCount++; pageNew++; }
        } catch (rowErr) {
          // Don't let one bad row break the whole sync
          pageSkip++;
          const msg = (rowErr && (rowErr.message || rowErr.stack)) || (typeof rowErr === 'string' ? rowErr : JSON.stringify(rowErr));
          if (pageSkip <= 3) {
            // Only print the first 3 per page so we don't flood the screen
            console.log(`    ⚠ skipped review ${r && r.reviewId}: ${msg}`);
            // Dump the problem review to a debug file so we can see what's wrong
            try {
              const debugPath = path.join(dataDir, 'debug-bad-reviews.json');
              const entry = JSON.stringify({ error: msg, review: r }, null, 2) + '\n,\n';
              fs.appendFileSync(debugPath, entry);
            } catch (e) {}
          }
        }
      }
      db.run('COMMIT');

      totalFetched += reviews.length;
      const skipNote = pageSkip > 0 ? ` (${pageSkip} skipped)` : '';
      console.log(`  page ${pageNum}: ${reviews.length} reviews (total ${totalFetched})${skipNote}`);

      // Save progress every page — small files, safer
      try {
        fs.writeFileSync(dbPath, Buffer.from(db.export()));
      } catch (saveErr) {
        console.log(`  ⚠ couldn't save db after page ${pageNum}: ${saveErr.message}`);
      }

      // Okendo returns a relative nextUrl like:
      //   /enterprise/reviews?limit=100&orderBy=date%20desc&lastEvaluated=<json>
      // We just need to extract the lastEvaluated cursor from it.
      const nextUrl = data.nextUrl || data.nextPageUrl || data.next || null;
      if (!nextUrl) break;
      try {
        const u = new URL(nextUrl, 'https://api.okendo.io');
        lastEvaluated = u.searchParams.get('lastEvaluated');
      } catch (e) {
        lastEvaluated = null;
      }
      if (!lastEvaluated) break;

      await new Promise((r) => setTimeout(r, 250));
    }

    // Final save
    const buf = Buffer.from(db.export());
    fs.writeFileSync(dbPath, buf);

    const finishedAt = new Date().toISOString();
    db.run(
      `INSERT INTO sync_log (started_at, finished_at, reviews_fetched, reviews_new, reviews_updated, error)
       VALUES (?, ?, ?, ?, ?, NULL)`,
      [startedAt, finishedAt, totalFetched, newCount, updatedCount]
    );
    fs.writeFileSync(dbPath, Buffer.from(db.export()));

    console.log(`\n✅ Sync complete`);
    console.log(`   Total fetched: ${totalFetched}`);
    console.log(`   New: ${newCount}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`\nRun 'npm run stats' to see the report.`);
  } catch (err) {
    // Save what we have so far
    try { fs.writeFileSync(dbPath, Buffer.from(db.export())); } catch (e) {}
    const msg = err && (err.stack || err.message) ? (err.stack || err.message) : JSON.stringify(err);
    console.error(`\n❌ Sync failed on page ${pageNum} after ${totalFetched} reviews:`);
    console.error(msg);
    console.error(`\nDatabase saved with what we have so far.`);
    console.error(`Run 'npm run sync' again to resume from where we are.`);
    process.exit(1);
  }
}

sync();
