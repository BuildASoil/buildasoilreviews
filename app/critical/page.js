// app/critical/page.js
const { rows, getSiteStats, slugify } = require('../../lib/db');

// Force dynamic rendering — this page reads search params on every request
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BuildASoil Critical Reviews — 1, 2, and 3-Star Reviews (Unfiltered)',
  description:
    'Every BuildASoil review rated 1, 2, or 3 stars. We publish the critical feedback alongside the positive — read the full picture.',
};

function StarString({ rating }) {
  const full = Math.round(rating);
  return <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

export default async function CriticalPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page || '1', 10) || 1);
  const ratingFilter = params?.rating ? parseInt(params.rating, 10) : null;
  const PER_PAGE = 25;
  const offset = (page - 1) * PER_PAGE;

  const stats = await getSiteStats();
  const totalCritical = stats.distribution[1] + stats.distribution[2] + stats.distribution[3];

  // Build query
  const where = [`body IS NOT NULL AND length(body) > 30`];
  const qp = [];
  if (ratingFilter && [1, 2, 3].includes(ratingFilter)) {
    where.push(`rating = ?`);
    qp.push(ratingFilter);
  } else {
    where.push(`rating IN (1, 2, 3)`);
  }
  const whereSql = `WHERE ${where.join(' AND ')}`;

  const countResult = await rows(`SELECT COUNT(*) AS c FROM reviews ${whereSql}`, qp);
  const totalMatches = countResult[0]?.c || 0;
  const totalPages = Math.max(1, Math.ceil(totalMatches / PER_PAGE));

  // Pull rating-by-year stats to show the improvement trajectory
  const trendRows = await rows(`
    SELECT
      CAST(strftime('%Y', date_created) AS INTEGER) AS year,
      AVG(rating) AS avg_r,
      COUNT(*) AS c
    FROM reviews
    WHERE date_created IS NOT NULL
    GROUP BY year
    HAVING year IS NOT NULL AND year >= 2013
    ORDER BY year ASC
  `);
  const firstYearAvg = trendRows.length > 0 ? trendRows[0].avg_r : null;
  const recentYears = trendRows.slice(-3); // last 3 years
  const recentAvg =
    recentYears.length > 0
      ? recentYears.reduce((s, r) => s + r.avg_r * r.c, 0) /
        recentYears.reduce((s, r) => s + r.c, 0)
      : null;

  const criticalReviews = await rows(
    `SELECT reviewer_name, product_name, body, rating, date_created, is_verified, reply_body
     FROM reviews ${whereSql}
     ORDER BY date_created DESC
     LIMIT ${PER_PAGE} OFFSET ${offset}`,
    qp
  );

  function pageHref(p, r) {
    const sp = new URLSearchParams();
    if (r !== undefined ? r : ratingFilter) sp.set('rating', r !== undefined ? r : ratingFilter);
    if (p > 1) sp.set('page', p);
    const s = sp.toString();
    return s ? `/critical?${s}` : '/critical';
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> / Critical reviews
          </div>
          <h1>Critical BuildASoil reviews</h1>
          <p className="hero-sub" style={{ marginTop: 16 }}>
            Every review rated 1, 2, or 3 stars — {totalCritical.toLocaleString()} total. We
            publish them all, unfiltered, alongside the positive ones. A growing product
            that works perfectly for every customer every time doesn't exist, and we'd
            rather you see the whole picture.
          </p>
          <div className="summary-row">
            <span>
              <strong>{stats.distribution[3].toLocaleString()}</strong> 3-star
            </span>
            <span>·</span>
            <span>
              <strong>{stats.distribution[2].toLocaleString()}</strong> 2-star
            </span>
            <span>·</span>
            <span>
              <strong>{stats.distribution[1].toLocaleString()}</strong> 1-star
            </span>
            <span>·</span>
            <span>
              <strong>
                {((totalCritical / stats.total) * 100).toFixed(1)}%
              </strong>{' '}
              of all reviews
            </span>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 0, paddingBottom: 80 }}>
        <div
          style={{
            background: 'var(--bg-paper)',
            border: '1px solid var(--line)',
            borderLeft: '4px solid var(--leaf)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 36px',
            marginTop: -16,
            marginBottom: 32,
          }}
        >
          <h3 style={{ marginBottom: 12, fontSize: '1.4rem' }}>
            A note from BuildASoil
          </h3>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 14 }}>
            Over the last {stats.yearsActive}+ years, we&apos;ve grown into a much better
            company &mdash; and a lot of that growth came directly from our critical reviews.
            Every 1, 2, or 3-star review on this page taught us something. New
            formulations, better packaging, improved shipping, clearer instructions,
            stronger customer support &mdash; almost all of it traces back to a customer
            who took the time to tell us what wasn&apos;t working.
            {firstYearAvg && recentAvg && recentAvg > firstYearAvg ? (
              <>
                {' '}You can actually see it in the data: our average rating climbed
                from <strong>{firstYearAvg.toFixed(2)}&#9733;</strong> in our early years
                to <strong>{recentAvg.toFixed(2)}&#9733;</strong> across the last three.
              </>
            ) : null}
          </p>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 0 }}>
            <strong style={{ color: 'var(--ink)' }}>
              If you haven&apos;t tried BuildASoil in a while &mdash; or you tried us
              early on and it didn&apos;t go great &mdash; we&apos;d genuinely love
              another shot.
            </strong>{' '}
            We get better every year, and we have the receipts to prove it.{' '}
            <a href="https://buildasoil.com" style={{ color: 'var(--leaf)', fontWeight: 600 }}>
              See what&apos;s new at buildasoil.com →
            </a>
          </p>
        </div>

        <div className="filter-chips">
          <a href="/critical" className={`filter-chip ${!ratingFilter ? 'active' : ''}`}>
            All critical
          </a>
          <a href={pageHref(1, 3)} className={`filter-chip ${ratingFilter === 3 ? 'active' : ''}`}>
            3 star only
          </a>
          <a href={pageHref(1, 2)} className={`filter-chip ${ratingFilter === 2 ? 'active' : ''}`}>
            2 star only
          </a>
          <a href={pageHref(1, 1)} className={`filter-chip ${ratingFilter === 1 ? 'active' : ''}`}>
            1 star only
          </a>
        </div>

        <p style={{ color: 'var(--ink-mute)', fontSize: '0.92rem', marginBottom: 24 }}>
          Showing {Math.min(offset + 1, totalMatches).toLocaleString()}–
          {Math.min(offset + PER_PAGE, totalMatches).toLocaleString()} of{' '}
          <strong style={{ color: 'var(--ink)' }}>{totalMatches.toLocaleString()}</strong>{' '}
          critical reviews
        </p>

        <div className="reviews-list">
          {criticalReviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-head">
                <div>
                  <div className="reviewer">{r.reviewer_name || 'Verified buyer'}</div>
                  <div className="review-meta">
                    <StarString rating={r.rating} />
                    {r.is_verified ? <span className="verified-tag">Verified</span> : null}
                    <span>{new Date(r.date_created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="review-body">{r.body}</div>
              {r.product_name ? (
                <a href={`/products/${slugify(r.product_name)}`} className="review-product">
                  on {r.product_name} →
                </a>
              ) : null}
              {r.reply_body ? (
                <div className="review-reply">
                  <div className="reply-from">Reply from BuildASoil</div>
                  {r.reply_body}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="pagination">
            {page > 1 ? <a href={pageHref(page - 1)}>← Previous</a> : null}
            <span className="current">Page {page} of {totalPages}</span>
            {page < totalPages ? <a href={pageHref(page + 1)}>Next →</a> : null}
          </div>
        ) : null}
      </section>
    </>
  );
}
