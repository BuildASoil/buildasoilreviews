// app/products/page.js
const { rows, getSiteStats, slugify } = require('../../lib/db');
const { getActiveProductTitlesSet, normalizeName } = require('../../lib/shopify');

// Re-render hourly to pick up new/removed Shopify products
export const revalidate = 3600;

export const metadata = {
  title: 'BuildASoil Products by Review — All Active Products Ranked by Customer Feedback',
  description:
    'Every currently-available BuildASoil product with its verified customer rating, review count, and direct links to reviews. Filtered to active products only.',
};

function StarString({ rating }) {
  const full = Math.round(rating);
  return <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

export default async function ProductsPage() {
  const stats = await getSiteStats();

  // Pull all products that have reviews (any time, any product)
  const allProducts = await rows(`
    SELECT product_name, COUNT(*) AS c, AVG(rating) AS avg_r
    FROM reviews
    WHERE product_name IS NOT NULL
    GROUP BY product_name
    HAVING c >= 3
    ORDER BY c DESC
  `);

  // Filter to only those currently active in Shopify
  const activeSet = await getActiveProductTitlesSet();
  const activeProducts = activeSet
    ? allProducts.filter((p) => activeSet.has(normalizeName(p.product_name)))
    : allProducts; // If Shopify fetch failed, show all (fail open)

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> / Products
          </div>
          <h1>BuildASoil products with verified customer reviews</h1>
          <p className="hero-sub" style={{ marginTop: 16 }}>
            {activeProducts.length} currently-available BuildASoil products with 3 or more
            verified customer reviews, sorted by total review volume. Click any product
            to read every review and see filtered ratings.
          </p>
          {activeSet && allProducts.length > activeProducts.length ? (
            <p style={{ color: 'var(--ink-mute)', fontSize: '0.85rem', marginTop: 12 }}>
              Showing only products currently for sale on buildasoil.com.
              {' '}{(allProducts.length - activeProducts.length).toLocaleString()} reviewed
              products are no longer in our catalog — their reviews are still
              searchable in <a href="/reviews" style={{ color: 'var(--leaf)' }}>all reviews</a>.
            </p>
          ) : null}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="products-grid">
          {activeProducts.map((p) => (
            <a key={p.product_name} href={`/products/${slugify(p.product_name)}`} className="product-card">
              <div className="product-name">{p.product_name}</div>
              <div className="product-meta">
                <StarString rating={p.avg_r} />
                <span className="rating-num">{p.avg_r.toFixed(2)}</span>
                <span className="count">· {p.c.toLocaleString()} reviews</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
