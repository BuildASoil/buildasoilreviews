// app/vs/page.js
const { competitors } = require('../../lib/competitors');
const { getSiteStats } = require('../../lib/db');

export const metadata = {
  title: 'BuildASoil vs Other Soils — Honest Side-by-Side Comparisons',
  description:
    'Fair, factual comparisons of BuildASoil against Fox Farm Ocean Forest, Happy Frog, Roots Organics, Coast of Maine Stonington, and more. Real review data, real differences, no spin.',
};

export default async function VsHubPage() {
  const stats = await getSiteStats();
  const list = Object.values(competitors);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> / Comparisons
          </div>
          <h1>BuildASoil vs other soils</h1>
          <p className="hero-sub" style={{ marginTop: 16 }}>
            Honest, side-by-side comparisons of BuildASoil against the most commonly
            asked-about competitors. We include where each soil genuinely wins — because
            no single soil is the right choice for every grower, every budget, or every
            growing style. Backed by {stats.total.toLocaleString()} verified BuildASoil
            customer reviews.
          </p>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="products-grid">
          {list.map((c) => (
            <a key={c.slug} href={`/vs/${c.slug}`} className="product-card">
              <div className="product-name">BuildASoil vs {c.name}</div>
              <div className="product-meta">
                <span className="count" style={{ fontSize: '0.88rem' }}>
                  {c.brand}
                </span>
              </div>
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--ink-soft)',
                marginTop: 14,
                lineHeight: 1.55,
              }}>
                {c.blurb}
              </p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
