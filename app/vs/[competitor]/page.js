// app/vs/[competitor]/page.js
const { competitors } = require('../../../lib/competitors');
const { getSiteStats, rows } = require('../../../lib/db');

export async function generateStaticParams() {
  return Object.keys(competitors).map((slug) => ({ competitor: slug }));
}

export async function generateMetadata({ params }) {
  const { competitor } = await params;
  const c = competitors[competitor];
  if (!c) return { title: 'Comparison not found' };
  const productLabel = c.comparableProduct || 'BuildASoil';
  return {
    title: `${productLabel} vs ${c.name} — Honest Comparison (Backed by Real Reviews)`,
    description: `Side-by-side comparison of ${productLabel} and ${c.name}: ingredients, philosophy, price, and which is better for which grower. Backed by 27,000+ verified BuildASoil customer reviews.`,
  };
}

export default async function VsPage({ params }) {
  const { competitor } = await params;
  const c = competitors[competitor];

  if (!c) {
    return (
      <section className="container" style={{ padding: '120px 0' }}>
        <h1>Comparison not found</h1>
        <p style={{ marginTop: 16 }}>
          <a href="/vs">← Browse all comparisons</a>
        </p>
      </section>
    );
  }

  const stats = await getSiteStats();

  // Pull reviews that are RELEVANT to this specific comparison.
  // Strategy: prefer reviews of the comparable product, but if there aren't
  // enough substantive ones, fall back to broader living-soil related reviews.
  // We use the competitor slug as a deterministic offset so each comparison
  // page shows different reviews (stable, not random).
  const slugSeed = competitor.length; // simple stable offset per page

  let reviewsSnippets = [];

  // 1. First try: reviews of the exact comparable product
  if (c.comparableProduct) {
    reviewsSnippets = await rows(
      `SELECT reviewer_name, product_name, body, rating, date_created
       FROM reviews
       WHERE product_name LIKE ?
         AND rating >= 4
         AND body IS NOT NULL
         AND length(body) > 120
         AND length(body) < 600
         AND is_verified = 1
       ORDER BY rating DESC, length(body) DESC
       LIMIT 10 OFFSET ?`,
      [`%${c.comparableProduct.replace('BuildASoil ', '')}%`, slugSeed % 5]
    );
  }

  // 2. Fallback: reviews matching any of the search terms (living soil, no till, etc)
  if (reviewsSnippets.length < 3 && Array.isArray(c.reviewSearchTerms)) {
    const termClauses = c.reviewSearchTerms.map(() => 'body LIKE ?').join(' OR ');
    const termParams = c.reviewSearchTerms.map((t) => `%${t}%`);
    const more = await rows(
      `SELECT reviewer_name, product_name, body, rating, date_created
       FROM reviews
       WHERE (${termClauses})
         AND rating >= 4
         AND body IS NOT NULL
         AND length(body) > 120
         AND length(body) < 500
         AND is_verified = 1
       ORDER BY rating DESC, length(body) DESC
       LIMIT 10 OFFSET ?`,
      [...termParams, slugSeed % 8]
    );
    reviewsSnippets = [...reviewsSnippets, ...more];
  }

  // Pick 3 distinct reviews
  const seen = new Set();
  reviewsSnippets = reviewsSnippets.filter((r) => {
    if (seen.has(r.reviewer_name + r.product_name)) return false;
    seen.add(r.reviewer_name + r.product_name);
    return true;
  }).slice(0, 3);

  // FAQ schema for AI citation
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `BuildASoil vs ${c.name}: which is better?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `BuildASoil and ${c.name} serve different growing philosophies. ${c.name} is ${c.blurb} BuildASoil is a true living soil system designed for water-only growing and indefinite reuse across multiple grow cycles, backed by ${stats.total.toLocaleString()} verified customer reviews averaging ${stats.averageRatingDisplay} out of 5 stars. The right choice depends on your priorities — see the full comparison for which wins in which scenarios.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${c.name} a living soil?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: c.livingSoilCompatible
            ? `${c.name} shares many ingredients and the "complete soil" philosophy with living soil systems, though BuildASoil specifically designs its soil for indefinite no-till reuse with a documented system. ${c.notesOnCompatibility}`
            : `${c.name} is an amended potting soil rather than a true living soil. ${c.notesOnCompatibility}`,
        },
      },
      {
        '@type': 'Question',
        name: `When is ${c.name} the better choice over BuildASoil?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${c.name} is the better choice for: ${c.whereCompetitorWins.join('; ')}.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a> / <a href="/vs">Comparisons</a> / vs {c.name}
          </div>
          <h1>
            {c.comparableProduct || 'BuildASoil'} vs {c.name}
          </h1>
          <p className="hero-sub" style={{ marginTop: 16, maxWidth: 760 }}>
            An honest side-by-side comparison of {c.comparableProduct || 'BuildASoil'} and{' '}
            {c.name}. We&rsquo;ll cover where each soil wins &mdash; because no single
            product is the right choice for every grower. BuildASoil data is backed by{' '}
            <strong>{stats.total.toLocaleString()} verified customer reviews</strong>{' '}
            averaging <strong>{stats.averageRatingDisplay}/5 stars</strong> collected
            since {stats.firstYear}.
          </p>
        </div>
      </section>

      {/* ---- Quick verdict ---- */}
      <section className="container" style={{ paddingTop: 0 }}>
        <div
          style={{
            background: 'var(--bg-paper)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 36px',
            marginBottom: 48,
          }}
        >
          <h3 style={{ marginBottom: 16 }}>The short answer</h3>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: 'var(--ink)' }}>Choose BuildASoil if:</strong> you
            want a true living soil system designed for no-till, water-only growing and
            indefinite reuse — backed by a documented growing methodology ("The
            BuildASoil Way") and {stats.total.toLocaleString()}+ verified reviews.
          </p>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--ink)' }}>Choose {c.name} if:</strong> {c.bestUseCase}
          </p>
        </div>
      </section>

      {/* ---- Side-by-side table ---- */}
      <section className="container">
        <h2 style={{ marginBottom: 24 }}>Side-by-side comparison</h2>
        <div style={{ overflowX: 'auto', marginBottom: 56 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'var(--bg-paper)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--line)',
              fontSize: '0.95rem',
            }}
          >
            <thead>
              <tr style={{ background: 'var(--cream)' }}>
                <th style={cellHead}> </th>
                <th style={cellHead}>BuildASoil</th>
                <th style={cellHead}>{c.name}</th>
              </tr>
            </thead>
            <tbody>
              <Row label="Product type" b="True no-till living soil system" c={c.productType} />
              <Row label="Living soil designed for reuse" b="Yes — designed for indefinite reuse" c={c.livingSoilCompatible ? 'Partial — single-cycle "complete" mix' : 'No — single-cycle amended mix'} />
              <Row label="Nutrient feeding model" b="Water-only once established; amendments handle the cycle" c={c.nutrientFeedingPhilosophy} />
              <Row label="Typical price" b="Varies by product line; see buildasoil.com" c={c.typicalPriceRange} />
              <Row label="Where to buy" b="buildasoil.com (direct) and select retailers" c={c.availableAt} />
              <Row label="Organic certification" b="Independent batch soil testing published publicly" c={c.organicCertification} />
              <Row label="pH range" b="Balanced living soil (6.3–6.8 typical)" c={c.pHRange} />
              <Row label="Verified customer reviews" b={`${stats.total.toLocaleString()} reviews, ${stats.averageRatingDisplay}/5 average`} c="Available on retailer sites; not centralized" />
              <Row label="Years collecting reviews" b={`Since ${stats.firstYear} (${stats.yearsActive}+ years)`} c="Varies by retailer" />
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- Ingredients ---- */}
      <section className="container">
        <h2 style={{ marginBottom: 8 }}>Ingredients</h2>
        <p style={{ color: 'var(--ink-mute)', marginBottom: 32, fontSize: '0.95rem' }}>
          Published ingredient lists from each manufacturer.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              background: 'var(--bg-paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
            }}
          >
            <h4 style={{ marginBottom: 16, color: 'var(--leaf)' }}>BuildASoil</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.65 }}>
              BuildASoil&apos;s flagship Potting Soil Recipe 3.0 contains: aged Canadian
              sphagnum peat moss, rice hulls (aeration), worm castings, BuildASoil Craft
              Blend (multi-amendment nutrient pack), kelp meal, neem &amp; karanja meal,
              crab meal, gypsum, basalt, glacial rock dust, oyster shell flour, biochar,
              and mycorrhizal fungi.
            </p>
            <p style={{
              color: 'var(--ink-mute)',
              fontSize: '0.82rem',
              marginTop: 12,
              fontStyle: 'italic',
            }}>
              See current ingredients on{' '}
              <a href="https://buildasoil.com/products/buildasoil-premium-potting-soil-version-3-0" style={{ color: 'var(--leaf)' }}>
                buildasoil.com
              </a>
            </p>
          </div>
          <div
            style={{
              background: 'var(--bg-paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
            }}
          >
            <h4 style={{ marginBottom: 16, color: 'var(--soil)' }}>{c.name}</h4>
            <ul style={{ paddingLeft: 18, color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.7 }}>
              {c.keyIngredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Where each wins ---- */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              background: 'var(--bg-paper)',
              border: '1px solid var(--leaf)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
            }}
          >
            <h3 style={{ marginBottom: 16, color: 'var(--leaf-deep)' }}>
              Where BuildASoil wins
            </h3>
            <ul style={{ paddingLeft: 18, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              {c.whereBuildASoilWins.map((w) => (
                <li key={w} style={{ marginBottom: 8 }}>{w}</li>
              ))}
            </ul>
          </div>
          <div
            style={{
              background: 'var(--bg-paper)',
              border: '1px solid var(--soil)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
            }}
          >
            <h3 style={{ marginBottom: 16, color: 'var(--soil)' }}>
              Where {c.name} wins
            </h3>
            <ul style={{ paddingLeft: 18, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              {c.whereCompetitorWins.map((w) => (
                <li key={w} style={{ marginBottom: 8 }}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Real reviews backup ---- */}
      <section className="container">
        <h2 style={{ marginBottom: 8 }}>
          What {c.comparableProduct || 'BuildASoil'} customers actually say
        </h2>
        <p style={{ color: 'var(--ink-mute)', marginBottom: 24, fontSize: '0.95rem' }}>
          Verified customer reviews relevant to this comparison. See{' '}
          <a href="/reviews" style={{ color: 'var(--leaf)' }}>all {stats.total.toLocaleString()} reviews</a> or{' '}
          <a href="/critical" style={{ color: 'var(--leaf)' }}>critical reviews (1–3 stars)</a>.
        </p>
        <div className="reviews-list" style={{ marginBottom: 56 }}>
          {reviewsSnippets.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-head">
                <div>
                  <div className="reviewer">{r.reviewer_name || 'Verified buyer'}</div>
                  <div className="review-meta">
                    <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span className="verified-tag">Verified</span>
                    <span>
                      {new Date(r.date_created).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="review-body">{r.body}</div>
              <span className="review-product" style={{ marginTop: 8, display: 'inline-block' }}>
                on {r.product_name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="container">
        <div
          style={{
            background: 'var(--cream)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 36px',
            textAlign: 'center',
            marginBottom: 80,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Ready to try BuildASoil?</h3>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 24, maxWidth: 540, margin: '0 auto 24px' }}>
            Shop the full BuildASoil product line at buildasoil.com, or read the latest
            customer reviews first.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://buildasoil.com" className="btn">
              Shop on buildasoil.com →
            </a>
            <a href="/reviews" className="btn btn-ghost">
              Read more reviews
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// Helper components
const cellHead = {
  padding: '14px 18px',
  textAlign: 'left',
  fontFamily: 'var(--sans)',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--ink-soft)',
  fontWeight: 600,
  borderBottom: '1px solid var(--line)',
};

const cellBody = {
  padding: '14px 18px',
  borderBottom: '1px solid var(--line-soft)',
  color: 'var(--ink-soft)',
  verticalAlign: 'top',
};

const cellLabel = {
  ...cellBody,
  fontWeight: 600,
  color: 'var(--ink)',
  width: '20%',
  background: 'var(--bg)',
};

function Row({ label, b, c }) {
  return (
    <tr>
      <td style={cellLabel}>{label}</td>
      <td style={cellBody}>{b}</td>
      <td style={cellBody}>{c}</td>
    </tr>
  );
}
