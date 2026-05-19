// app/reviews/page.js
const { rows, scalar, getSiteStats, slugify } = require('../../lib/db');

// Force dynamic rendering — this page reads search params on every request
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All BuildASoil Reviews — Searchable Database of 27,000+ Verified Reviews',
  description:
    'Search and filter every verified BuildASoil customer review. Filter by rating, photos, product, and keyword.',
};

function StarString({ rating }) {
  const full = Math.round(rating);
  return <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

export default async function ReviewsPage({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || '').toString().trim();
  const ratingFilter = params?.rating ? parseInt(params.rating, 10) : null;
  const photosOnly = params?.photos === '1';
  const page = Math.max(1, parseInt(params?.page || '1', 10) || 1);
  const PER_PAGE = 25;

  const stats = await getSiteStats();

  // Build WHERE clause
  const where = [];
  const queryParams = [];
  if (q) {
    where.push(`(body LIKE ? OR title LIKE ? OR product_name LIKE ?)`);
    queryParams.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (ratingFilter && [1, 2, 3, 4, 5].includes(ratingFilter)) {
    where.push(`rating = ?`);
    queryParams.push(ratingFilter);
  }
  if (photosOnly) where.push(`has_media = 1`);
  where.push(`body IS NOT NULL AND length(body) > 30`);
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // Count
  const countResult = await rows(`SELECT COUNT(*) AS c FROM reviews ${whereSql}`, queryParams);
  const totalMatches = countResult[0]?.c || 0;
  const totalPages = Math.max(1, Math.ceil(totalMatches / PER_PAGE));

  // Fetch page
  const offset = (page - 1) * PER_PAGE;
  const reviewsList = await rows(
    `SELECT reviewer_name, product_name, body, rating, date_created, is_verified, has_media, reply_body
     FROM reviews ${whereSql}
     ORDER BY date_created DESC
     LIMIT ${PER_PAGE} OFFSET ${offset}`,
    queryParams
  );

  function chipHref(extra) {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (ratingFilter) sp.set('rating', ratingFilter);
    if (photosOnly) sp.set('photos', '1');
    for (const [k, v] of Object.entries(extra)) {
      if (v === null || v === undefined) sp.delete(k);
      else sp.set(k, v);
    }
    sp.delete('page');
    const s = sp.toString();
    return s ? `/reviews?${s}` : '/reviews';
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> / Reviews
          </div>
          <h1>All BuildASoil reviews</h1>
          <p className="hero-sub" style={{ marginTop: 16 }}>
            Search and filter {stats.total.toLocaleString()} verified customer reviews.
            Every review pulled directly from our Okendo platform.
          </p>
        </div>
      </section>

      <section className="container">
        <form className="search-bar" method="GET">
          <input
            type="search"
            name="q"
            placeholder="Search reviews (e.g. &ldquo;indoor tent&rdquo;, &ldquo;first time&rdquo;, &ldquo;craft blend&rdquo;)"
            defaultValue={q}
          />
          <select name="rating" defaultValue={ratingFilter || ''}>
            <option value="">All ratings</option>
            <option value="5">5 stars only</option>
            <option value="4">4 stars only</option>
            <option value="3">3 stars only</option>
            <option value="2">2 stars only</option>
            <option value="1">1 star only</option>
          </select>
          <button type="submit">Search</button>
        </form>

        <div className="filter-chips">
          <a href={chipHref({ photos: photosOnly ? null : '1' })} className={`filter-chip ${photosOnly ? 'active' : ''}`}>
            {photosOnly ? '✓ ' : ''}With photos only
          </a>
          {q || ratingFilter || photosOnly ? (
            <a href="/reviews" className="filter-chip">✕ Clear filters</a>
          ) : null}
        </div>

        <p style={{ color: 'var(--ink-mute)', fontSize: '0.92rem', marginBottom: 24 }}>
          Showing {Math.min(offset + 1, totalMatches).toLocaleString()}–
          {Math.min(offset + PER_PAGE, totalMatches).toLocaleString()} of{' '}
          <strong style={{ color: 'var(--ink)' }}>{totalMatches.toLocaleString()}</strong>{' '}
          matching reviews
        </p>

        <div className="reviews-list">
          {reviewsList.length === 0 ? (
            <p style={{ padding: '48px 0', color: 'var(--ink-mute)' }}>
              No reviews match those filters. Try clearing them or searching for something else.
            </p>
          ) : (
            reviewsList.map((r, i) => (
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
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 ? (
          <div className="pagination">
            {page > 1 ? (
              <a href={chipHref({ page: page - 1 })}>← Previous</a>
            ) : null}
            <span className="current">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <a href={chipHref({ page: page + 1 })}>Next →</a>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  );
}
