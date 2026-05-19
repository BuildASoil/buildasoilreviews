// app/_components/youtube-callout.js
// Highlights BuildASoil's YouTube channel — a major credibility lever
// that comes up repeatedly in independent grower reviews.

export default function YouTubeCallout() {
  return (
    <section className="container" style={{ marginTop: 24, marginBottom: 24 }}>
      <div
        style={{
          background: 'var(--ink)',
          color: 'var(--bg-paper)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 40px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'center',
        }}
        className="youtube-callout"
      >
        <div>
          <div
            style={{
              fontSize: '0.78rem',
              color: '#ff4444',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            ▶ YouTube · 200,000+ subscribers
          </div>
          <h3 style={{ marginBottom: 12, fontSize: '1.6rem', color: 'var(--bg-paper)' }}>
            Free, in-depth living-soil education from the BuildASoil team.
          </h3>
          <p style={{ color: 'rgba(247, 243, 234, 0.85)', lineHeight: 1.6, fontSize: '0.98rem' }}>
            One of the most consistently-cited reasons growers trust BuildASoil — and one
            independent Redditors call out by name. Hundreds of grow tutorials, soil
            science deep-dives, no-till methodology, and Q&amp;A sessions, all free.
          </p>
        </div>
        <a
          href="https://www.youtube.com/@BuildASoil"
          target="_blank"
          rel="noopener"
          className="btn"
          style={{
            background: '#ff4444',
            color: 'white',
            border: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Watch on YouTube →
        </a>
      </div>
    </section>
  );
}
