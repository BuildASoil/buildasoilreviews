// scripts/show-stats.js
// Shows summary stats about your synced review data.
// Run with: npm run stats

const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

async function main() {
  const dbPath = path.join(__dirname, '..', 'data', 'reviews.db');
  if (!fs.existsSync(dbPath)) {
    console.log('No database yet. Run `npm run sync` first.');
    process.exit(0);
  }

  const SQL = await initSqlJs();
  const db = new SQL.Database(fs.readFileSync(dbPath));

  function scalar(sql) {
    const r = db.exec(sql);
    if (r.length === 0 || r[0].values.length === 0) return null;
    return r[0].values[0][0];
  }
  function rows(sql) {
    const r = db.exec(sql);
    if (r.length === 0) return [];
    const cols = r[0].columns;
    return r[0].values.map((vals) => {
      const obj = {};
      cols.forEach((c, i) => { obj[c] = vals[i]; });
      return obj;
    });
  }

  function fmt(n) { return Number(n).toLocaleString(); }
  function pct(n, total) { return total ? `${((n / total) * 100).toFixed(1)}%` : '0%'; }

  const total = scalar('SELECT COUNT(*) FROM reviews');
  if (!total || total === 0) {
    console.log('No reviews in the database yet. Run `npm run sync` first.');
    process.exit(0);
  }

  console.log('━'.repeat(60));
  console.log('  BuildASoil Reviews — Data Summary');
  console.log('━'.repeat(60));
  console.log();

  console.log(`Total reviews:        ${fmt(total)}`);
  const avgRating = scalar('SELECT AVG(rating) FROM reviews WHERE rating IS NOT NULL');
  console.log(`Average rating:       ${avgRating ? avgRating.toFixed(2) : 'n/a'} / 5`);

  const verified = scalar('SELECT COUNT(*) FROM reviews WHERE is_verified = 1');
  console.log(`Verified purchases:   ${fmt(verified)} (${pct(verified, total)})`);

  const withPhotos = scalar('SELECT COUNT(*) FROM reviews WHERE has_media = 1');
  console.log(`Reviews with photos:  ${fmt(withPhotos)} (${pct(withPhotos, total)})`);

  const withReplies = scalar(`SELECT COUNT(*) FROM reviews WHERE reply_body IS NOT NULL AND reply_body != ''`);
  console.log(`Reviews with a reply: ${fmt(withReplies)} (${pct(withReplies, total)})`);

  const recommended = scalar('SELECT COUNT(*) FROM reviews WHERE is_recommended = 1');
  console.log(`"Would recommend":    ${fmt(recommended)} (${pct(recommended, total)})`);

  console.log();
  console.log('Rating distribution:');
  const dist = rows(`SELECT rating, COUNT(*) AS c FROM reviews WHERE rating IS NOT NULL GROUP BY rating ORDER BY rating DESC`);
  const maxCount = Math.max(...dist.map((d) => d.c));
  for (const row of dist) {
    const bar = '█'.repeat(Math.round((row.c / maxCount) * 30));
    console.log(`  ${row.rating}★  ${bar.padEnd(30)} ${fmt(row.c).padStart(6)}  (${pct(row.c, total)})`);
  }

  console.log();
  console.log('Top 15 products by review count:');
  const topProducts = rows(`
    SELECT product_name, COUNT(*) AS c, AVG(rating) AS avg_r
    FROM reviews WHERE product_name IS NOT NULL
    GROUP BY product_name ORDER BY c DESC LIMIT 15
  `);
  for (const row of topProducts) {
    const name = (row.product_name || '').slice(0, 40).padEnd(42);
    console.log(`  ${name} ${fmt(row.c).padStart(5)} reviews   ${row.avg_r.toFixed(2)}★`);
  }

  console.log();
  const dr = rows('SELECT MIN(date_created) AS first, MAX(date_created) AS last FROM reviews');
  const dateRange = dr[0] || {};
  console.log('Date range:');
  console.log(`  First review: ${dateRange.first || 'n/a'}`);
  console.log(`  Latest:       ${dateRange.last || 'n/a'}`);

  const last30 = scalar(`SELECT COUNT(*) FROM reviews WHERE date_created >= datetime('now','-30 days')`);
  const last90 = scalar(`SELECT COUNT(*) FROM reviews WHERE date_created >= datetime('now','-90 days')`);
  console.log(`  Last 30 days: ${fmt(last30)} reviews`);
  console.log(`  Last 90 days: ${fmt(last90)} reviews`);

  console.log();
  console.log('Sample 5-star reviews (for sanity check):');
  const samples = rows(`
    SELECT reviewer_name, product_name, body FROM reviews
    WHERE rating = 5 AND body IS NOT NULL AND length(body) > 80
    ORDER BY RANDOM() LIMIT 3
  `);
  for (const s of samples) {
    console.log();
    console.log(`  — ${s.reviewer_name || 'Anon'} on ${s.product_name || 'Unknown'}:`);
    const body = (s.body || '').replace(/\s+/g, ' ');
    console.log(`    "${body.slice(0, 200)}${body.length > 200 ? '…' : ''}"`);
  }

  console.log();
  console.log('━'.repeat(60));
}

main().catch((e) => { console.error(e); process.exit(1); });
