// app/products/[slug]/page.js
const { rows, scalar, slugify } = require('../../../lib/db');

function StarString({ rating }) {
  const full = Math.round(rating);
  return <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

// Generate static params so every product gets a pre-rendered page
export async function generateStaticParams() {
  const products = await rows(`
    SELECT product_name FROM reviews
    WHERE product_name IS NOT NULL
    GROUP BY product_name
    HAVING COUNT(*) >= 3
  `);
  return products.map((p) => ({ slug: slugify(p.product_name) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await rows(`
    SELECT product_name, COUNT(*) AS c, AVG(rating) AS avg_r
    FROM reviews WHERE product_name IS NOT NULL
    GROUP BY product_name
  `);
  const product = products.find((p) => slugify(p.product_name) === slug);
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.product_name} Reviews — ${product.avg_r.toFixed(2)}★ from ${product.c.toLocaleString()} verified buyers`,
    description: `${product.c.toLocaleString()} verified customer reviews of ${product.product_name} from BuildASoil. ${product.avg_r.toFixed(2)} out of 5 average rating.`,
  };
}

export default async function ProductPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const ratingFilter = sp?.rating ? parseInt(sp.rating, 10) : null;

  // Find product by slug
  const allProducts = await rows(`
    SELECT product_name, COUNT(*) AS c, AVG(rating) AS avg_r,
           SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS r5,
           SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS r4,
           SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS r3,
           SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS r2,
           SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS r1,
           SUM(CASE WHEN has_media = 1 THEN 1 ELSE 0 END) AS with_photos
    FROM reviews WHERE product_name IS NOT NULL
    GROUP BY product_name
  `);
  const product = allProducts.find((p) => slugify(p.product_name) === slug);

  if (!product) {
    return (
      <section className="container" style={{ padding: '120px 0' }}>
        <h1>Product not found</h1>
        <p style={{ marginTop: 16 }}>
          <a href="/products">← Browse all products</a>
        </p>
      </section>
    );
  }

  // Build review query
  const where = [`product_name = ?`, `body IS NOT NULL AND length(body) > 30`];
  const qp = [product.product_name];
  if (ratingFilter) {
    where.push(`rating = ?`);
    qp.push(ratingFilter);
  }
  const whereSql = `WHERE ${where.join(' AND ')}`;

  const productReviews = await rows(
    `SELECT reviewer_name, body, rating, date_created, is_verified, reply_body
     FROM reviews ${whereSql}
     ORDER BY date_created DESC
     LIMIT 50`,
    qp
  );

  // Per-product schema markup
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.product_name,
    brand: { '@type': 'Brand', name: 'BuildASoil' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.avg_r.toFixed(2),
      reviewCount: product.c,
      bestRating: 5,
      worstRating: 1,
    },
    review: productReviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.reviewer_name || 'Verified buyer' },
      datePublished: r.date_created,
      reviewBody: r.body,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };

  function ratingLink(r) {
    const sp = new URLSearchParams();
    if (r) sp.set('rating', r);
    const s = sp.toString();
    return s ? `?${s}` : './';
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> / <a href="/products">Products</a> / {product.product_name}
          </div>
          <h1>{product.product_name} Reviews</h1>
          <div className="summary-row">
            <span>
              <StarString rating={product.avg_r} />{' '}
              <strong>{product.avg_r.toFixed(2)}</strong> out of 5
            </span>
            <span>·</span>
            <span>
              <strong>{product.c.toLocaleString()}</strong> verified reviews
            </span>
            {product.with_photos > 0 ? (
              <>
                <span>·</span>
                <span>
                  <strong>{product.with_photos.toLocaleString()}</strong> with photos
                </span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="two-col">
          <div>
            <div className="filter-chips">
              <a href="./" className={`filter-chip ${!ratingFilter ? 'active' : ''}`}>
                All ratings
              </a>
              {[5, 4, 3, 2, 1].map((r) => (
                <a
                  key={r}
                  href={ratingLink(r)}
                  className={`filter-chip ${ratingFilter === r ? 'active' : ''}`}
                >
                  {r}★
                </a>
              ))}
            </div>

            <div className="reviews-list">
              {productReviews.length === 0 ? (
                <p style={{ padding: '40px 0', color: 'var(--ink-mute)' }}>
                  No reviews match that filter.
                </p>
              ) : (
                productReviews.map((r, i) => (
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
          </div>

          <aside className="sidebar">
            <div className="sidebar-block">
              <h4>Rating breakdown</h4>
              {[5, 4, 3, 2, 1].map((r) => {
                const count = product[`r${r}`];
                const pct = product.c > 0 ? (count / product.c) * 100 : 0;
                return (
                  <a
                    key={r}
                    href={ratingLink(r)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 0',
                      fontSize: '0.9rem',
                      color: 'var(--ink-soft)',
                    }}
                  >
                    <span style={{ width: 26 }}>{r}★</span>
                    <span
                      style={{
                        flex: 1,
                        height: 6,
                        background: 'var(--line-soft)',
                        borderRadius: 99,
                        overflow: 'hidden',
                      }}
                    >
                      <span
                        style={{
                          display: 'block',
                          height: '100%',
                          width: `${pct}%`,
                          background: 'var(--leaf)',
                        }}
                      />
                    </span>
                    <span style={{ minWidth: 50, textAlign: 'right', color: 'var(--ink-mute)' }}>
                      {count.toLocaleString()}
                    </span>
                  </a>
                );
              })}
            </div>
            <div className="sidebar-block">
              <h4>Get this product</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)', marginBottom: 14 }}>
                Shop {product.product_name} directly on buildasoil.com.
              </p>
              <a href="https://buildasoil.com" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                Shop on buildasoil.com →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
