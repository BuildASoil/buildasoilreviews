// app/_components/soil-wars-section.js
// Highlights the independent "Soil Wars" comparison test run by York River
// Cannabis (a Virginia hemp farm), in which BuildASoil 3.0 and BuildASoil
// Light took 1st and 2nd place against 8 other commercial bagged soils.

const SOIL_WARS_LINEUP = [
  { name: 'BuildASoil 3.0', placed: 1, isBuildASoil: true },
  { name: 'BuildASoil Light', placed: 2, isBuildASoil: true },
  { name: 'Bio 365 Bio All', placed: null, isBuildASoil: false },
  { name: 'Coast of Maine Stonington', placed: null, isBuildASoil: false },
  { name: 'Dirt Craft Organics', placed: null, isBuildASoil: false },
  { name: 'Soil King Big Rootz', placed: null, isBuildASoil: false },
  { name: 'Coast of Maine Potting Soil', placed: null, isBuildASoil: false },
  { name: 'HSH Organics', placed: null, isBuildASoil: false },
  { name: 'Pro-Mix BK25', placed: null, isBuildASoil: false },
  { name: 'Cannabus DC', placed: null, isBuildASoil: false },
  { name: 'Fox Farm Ocean Forest', placed: null, isBuildASoil: false },
];

const SOIL_WARS_URL = 'https://www.youtube.com/playlist?list=PLUwDkxyez_I3-oBNdM1i5VcS3r6jJ17vZ';

export default function SoilWarsSection() {
  return (
    <section className="section" style={{ background: 'var(--ink)', color: 'var(--bg-paper)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 14,
          color: '#d4a557',
          fontSize: '0.82rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
        }}>
          <span style={{ fontSize: '1.4rem' }}>🏆</span>
          <span>Independent Head-to-Head Test</span>
        </div>

        <h2 style={{ color: 'var(--bg-paper)', marginBottom: 12, fontSize: '2.2rem', lineHeight: 1.15 }}>
          BuildASoil swept 1st and 2nd in &ldquo;Soil Wars.&rdquo;
        </h2>

        <p style={{
          color: 'rgba(247, 243, 234, 0.85)',
          fontSize: '1.05rem',
          lineHeight: 1.6,
          maxWidth: 720,
          marginBottom: 32,
        }}>
          Virginia hemp farmer <a href="https://www.youtube.com/@YorkRiverhemp" target="_blank" rel="noopener" style={{ color: '#d4a557', textDecoration: 'underline' }}>York River Cannabis</a>{' '}
          grew identical plants in 11 different bagged soils side-by-side across a full season,
          documented in a 21-episode video series. We didn&rsquo;t pay for this, didn&rsquo;t
          sponsor it, and didn&rsquo;t know about it ahead of time. BuildASoil 3.0 finished{' '}
          <strong style={{ color: 'var(--bg-paper)' }}>first</strong>. BuildASoil Light finished{' '}
          <strong style={{ color: 'var(--bg-paper)' }}>second</strong>.
        </p>

        {/* Podium */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          marginBottom: 40,
        }} className="soil-wars-podium">
          <div style={{
            background: 'linear-gradient(135deg, #d4a557 0%, #b8893f 100%)',
            color: 'var(--ink)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6, opacity: 0.8 }}>
              🥇 1ST PLACE
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: 4 }}>
              BuildASoil 3.0
            </div>
            <div style={{ fontSize: '0.92rem', opacity: 0.75 }}>
              Recipe 3.0 Potting Soil
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #c0c0c0 0%, #8a8a8a 100%)',
            color: 'var(--ink)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6, opacity: 0.8 }}>
              🥈 2ND PLACE
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: 4 }}>
              BuildASoil Light
            </div>
            <div style={{ fontSize: '0.92rem', opacity: 0.75 }}>
              Light Mix
            </div>
          </div>
        </div>

        {/* Full lineup */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: '0.78rem',
            color: 'rgba(247, 243, 234, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
            marginBottom: 14,
          }}>
            All 11 soils in the test
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {SOIL_WARS_LINEUP.map((s) => (
              <span
                key={s.name}
                style={{
                  background: s.isBuildASoil ? '#d4a557' : 'rgba(247, 243, 234, 0.08)',
                  color: s.isBuildASoil ? 'var(--ink)' : 'rgba(247, 243, 234, 0.85)',
                  border: s.isBuildASoil ? 'none' : '1px solid rgba(247, 243, 234, 0.15)',
                  padding: '8px 14px',
                  borderRadius: 99,
                  fontSize: '0.88rem',
                  fontWeight: s.isBuildASoil ? 700 : 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {s.placed === 1 ? '🥇 ' : s.placed === 2 ? '🥈 ' : ''}{s.name}
              </span>
            ))}
          </div>
        </div>

        <a
          href={SOIL_WARS_URL}
          target="_blank"
          rel="noopener"
          className="btn"
          style={{
            background: '#d4a557',
            color: 'var(--ink)',
            border: 'none',
          }}
        >
          ▶ Watch all 21 episodes on YouTube →
        </a>
      </div>
    </section>
  );
}
