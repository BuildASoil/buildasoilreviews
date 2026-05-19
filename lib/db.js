// lib/db.js
// Shared database access for the Next.js site.
// Loads the SQLite file once and caches it for fast queries.

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let _db = null;
let _dbPromise = null;

async function getDb() {
  if (_db) return _db;
  if (_dbPromise) return _dbPromise;

  _dbPromise = (async () => {
    // Explicitly point sql.js at its WASM file. Without this, sql.js tries
    // to guess where the file lives, which fails on Vercel because the
    // serverless bundler relocates files. We resolve from node_modules ourselves.
    const SQL = await initSqlJs({
      locateFile: (filename) => {
        // Try a few known locations; first one that exists wins.
        const candidates = [
          path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', filename),
          path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', filename),
          // Fallback: read the WASM bytes directly via require.resolve
        ];
        for (const c of candidates) {
          if (fs.existsSync(c)) return c;
        }
        // Last resort: use require.resolve to find sql.js package and locate dist there
        try {
          const sqlJsPath = require.resolve('sql.js');
          const distDir = path.join(path.dirname(sqlJsPath), '..', 'dist');
          return path.join(distDir, filename);
        } catch (e) {
          return filename; // Let sql.js try its default
        }
      },
    });
    const dbPath = path.join(process.cwd(), 'data', 'reviews.db');
    if (!fs.existsSync(dbPath)) {
      throw new Error('reviews.db not found at ' + dbPath);
    }
    _db = new SQL.Database(fs.readFileSync(dbPath));
    return _db;
  })();

  return _dbPromise;
}

async function scalar(sql, params = []) {
  const db = await getDb();
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const has = stmt.step();
  const val = has ? stmt.get()[0] : null;
  stmt.free();
  return val;
}

async function rows(sql, params = []) {
  const db = await getDb();
  // Use exec for queries without params (faster, simpler)
  if (params.length === 0) {
    const r = db.exec(sql);
    if (r.length === 0) return [];
    const cols = r[0].columns;
    return r[0].values.map((vals) => {
      const obj = {};
      cols.forEach((c, i) => { obj[c] = vals[i]; });
      return obj;
    });
  }
  // For parameterized queries, use prepared statements
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}

// Site-wide aggregate stats (cached after first load)
let _stats = null;
async function getSiteStats() {
  if (_stats) return _stats;
  const total = await scalar('SELECT COUNT(*) FROM reviews');
  const avg = await scalar('SELECT AVG(rating) FROM reviews WHERE rating IS NOT NULL');
  const verified = await scalar('SELECT COUNT(*) FROM reviews WHERE is_verified = 1');
  const withPhotos = await scalar('SELECT COUNT(*) FROM reviews WHERE has_media = 1');
  const recommended = await scalar('SELECT COUNT(*) FROM reviews WHERE is_recommended = 1');
  const fiveStar = await scalar('SELECT COUNT(*) FROM reviews WHERE rating = 5');
  const fourStar = await scalar('SELECT COUNT(*) FROM reviews WHERE rating = 4');
  const threeStar = await scalar('SELECT COUNT(*) FROM reviews WHERE rating = 3');
  const twoStar = await scalar('SELECT COUNT(*) FROM reviews WHERE rating = 2');
  const oneStar = await scalar('SELECT COUNT(*) FROM reviews WHERE rating = 1');
  const firstDate = await scalar('SELECT MIN(date_created) FROM reviews');
  const latestDate = await scalar('SELECT MAX(date_created) FROM reviews');
  const productsTotal = await scalar('SELECT COUNT(DISTINCT product_name) FROM reviews WHERE product_name IS NOT NULL');

  _stats = {
    total,
    averageRating: avg,
    averageRatingDisplay: avg ? avg.toFixed(2) : '—',
    verified,
    withPhotos,
    recommended,
    distribution: { 5: fiveStar, 4: fourStar, 3: threeStar, 2: twoStar, 1: oneStar },
    firstDate,
    latestDate,
    firstYear: firstDate ? new Date(firstDate).getFullYear() : null,
    productsTotal,
    yearsActive: firstDate ? new Date().getFullYear() - new Date(firstDate).getFullYear() : null,
  };
  return _stats;
}

// Convert product name to URL slug
function slugify(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

module.exports = { getDb, scalar, rows, getSiteStats, slugify };
