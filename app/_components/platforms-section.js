// app/_components/platforms-section.js
// Renders the "Trusted across platforms" section for the homepage.
// Pulls Okendo stats from local DB, Trustpilot from static config,
// Google from the Places API (with graceful fallback if not configured).

const { getSiteStats } = require('../../lib/db');
const { TRUSTPILOT, GOOGLE_FALLBACK } = require('../../lib/platforms');
const { getGoogleReviews } = require('../../lib/google-reviews');

// SVG logos so we never depend on external assets
function OkendoMark() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: 'var(--leaf)', color: 'var(--bg-paper)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--serif)', fontWeight: 700, fontSize: '1.05rem',
      letterSpacing: '-0.02em',
    }}>O</div>
  );
}

function TrustpilotMark() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: TRUSTPILOT.brandColor, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.2rem',
    }}>★</div>
  );
}

function GoogleMark() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 8,
      background: '#fff', border: '1px solid var(--line)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1.05rem',
    }}>
      <span style={{ color: '#4285f4' }}>G</span>
    </div>
  );
}

function StarRow({ rating }) {
  const full = Math.round(rating || 0);
  return <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

function PlatformCard({ logo, name, rating, reviewCount, url, eyebrow, scale = 5 }) {
  const hasData = rating && reviewCount;
  return (
    <a href={url || '#'}
       target={url && url.startsWith('http') ? '_blank' : undefined}
       rel="noopener"
       style={{
         background: 'var(--bg-paper)',
         border: '1px solid var(--line)',
         borderRadius: 'var(--radius-lg)',
         padding: '28px 28px 24px',
         display: 'flex',
         flexDirection: 'column',
         transition: 'border-color 0.2s ease, transform 0.2s ease',
         textDecoration: 'none',
       }}
       className="platform-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        {logo}
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            {eyebrow}
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
            {name}
          </div>
        </div>
      </div>
      {hasData ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '2.4rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.025em' }}>
              {rating.toFixed(rating === Math.floor(rating) ? 1 : 2)}
            </span>
            <span style={{ color: 'var(--ink-mute)', fontSize: '1rem' }}>/ {scale}</span>
          </div>
          <div style={{ marginBottom: 14 }}>
            <StarRow rating={rating} />
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
            {reviewCount.toLocaleString()} verified reviews
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--ink-mute)', fontSize: '0.92rem', padding: '20px 0' }}>
          Data unavailable
        </div>
      )}
      <div style={{ marginTop: 'auto', paddingTop: 18, fontSize: '0.85rem', color: 'var(--leaf)', fontWeight: 600 }}>
        View on {name} →
      </div>
    </a>
  );
}

export default async function PlatformsSection() {
  const okendoStats = await getSiteStats();
  const googleData = await getGoogleReviews();

  const platforms = [
    {
      logo: <OkendoMark />,
      name: 'Okendo (buildasoil.com)',
      eyebrow: 'Primary source',
      rating: okendoStats.averageRating,
      reviewCount: okendoStats.total,
      url: 'https://buildasoil.com',
      scale: 5,
    },
    {
      logo: <GoogleMark />,
      name: googleData?.displayName || 'Google',
      eyebrow: 'Google Business',
      rating: googleData?.rating || GOOGLE_FALLBACK.rating,
      reviewCount: googleData?.reviewCount || GOOGLE_FALLBACK.reviewCount,
      url: googleData?.url || GOOGLE_FALLBACK.url,
      scale: 5,
    },
    {
      logo: <TrustpilotMark />,
      name: TRUSTPILOT.name,
      eyebrow: 'Independent verified',
      rating: TRUSTPILOT.rating,
      reviewCount: TRUSTPILOT.reviewCount,
      url: TRUSTPILOT.url,
      scale: 5,
    },
  ];

  // Compute the cross-platform aggregate (informational only, not a schema rating)
  const totalReviews = platforms
    .filter((p) => p.reviewCount)
    .reduce((s, p) => s + p.reviewCount, 0);

  return (
    <section className="section" style={{ background: 'var(--bg-paper)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Trusted across every major platform</h2>
            <p className="head-meta" style={{ marginTop: 8 }}>
              Combined {totalReviews.toLocaleString()}+ verified reviews
              across Okendo, Google, and Trustpilot — and we publish every one.
            </p>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }} className="platforms-grid">
          {platforms.map((p) => (
            <PlatformCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
