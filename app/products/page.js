// app/products/page.js
const { rows, getSiteStats, slugify } = require('../../lib/db');

export const metadata = {
  title: 'BuildASoil Products by Review — All Products Ranked by Customer Feedback',
  description:
    'Every BuildASoil product with its verified customer rating, review count, and direct links to reviews. Sorted by review volume.',
};

function StarString({ rating }) {
  const full = Math.round(rating);
  return <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

export default async function ProductsPage() {
  const stats = await getSiteStats();
  const allProducts = await rows(`
    SELECT product_name, COUNT(*) AS c, AVG(rating) AS avg_r
    FROM reviews
    WHERE product_name IS NOT NULL
    GROUP BY product_name
    HAVING c >= 3
    ORDER BY c DESC
  `);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> / Products
          </div>
          <h1>All BuildASoil products by review count</h1>
          <p className="hero-sub" style={{ marginTop: 16 }}>
            {allProducts.length} products with 3 or more verified customer reviews,
            sorted by total review volume. Click any product to read every review and
            see filtered ratings.
          </p>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="products-grid">
          {allProducts.map((p) => (
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
