// app/_components/independent-tests-section.js
// Features the two major independent head-to-head soil tests where BuildASoil
// finished 1st in both: York River Cannabis "Soil Wars" (11 soils) and
// Know Before You Grow's 26-bag retail-purchased test.

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
const KNOW_BEFORE_URL = 'https://buildasoil.com/pages/why-buildasoil';

export default function IndependentTestsSection() {
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
          <span>Independent Head-to-Head Tests</span>
        </div>

        <h2 style={{ color: 'var(--bg-paper)', marginBottom: 12, fontSize: '2.2rem', lineHeight: 1.15 }}>
          Two independent tests. Both ranked BuildASoil #1.
        </h2>

        <p style={{
          color: 'rgba(247, 243, 234, 0.85)',
          fontSize: '1.05rem',
          lineHeight: 1.6,
          maxWidth: 760,
          marginBottom: 36,
        }}>
          We didn&rsquo;t commission either of these. We didn&rsquo;t pay for them. We
          didn&rsquo;t even know they were happening. Two unrelated independent reviewers
          ran head-to-head soil tests on real plants, side-by-side, with documented
          results. <strong style={{ color: 'var(--bg-paper)' }}>BuildASoil finished first in both.</strong>
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
          marginBottom: 32,
        }} className="independent-tests-grid">

          {/* --- Test 1: Soil Wars --- */}
          <div style={{
            background: 'rgba(247, 243, 234, 0.04)',
            border: '1px solid rgba(212, 165, 87, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 28px 24px',
          }}>
            <div style={{
              fontSize: '0.72rem',
              color: '#d4a557',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
              marginBottom: 8,
            }}>
              Test 1 · 21-episode video series
            </div>
            <h3 style={{ color: 'var(--bg-paper)', fontSize: '1.4rem', marginBottom: 8 }}>
              &ldquo;Soil Wars&rdquo;
            </h3>
            <div style={{ color: 'rgba(247, 243, 234, 0.65)', fontSize: '0.88rem', marginBottom: 16 }}>
              by York River Cannabis (Virginia hemp farm)
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 16,
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #d4a557 0%, #b8893f 100%)',
                color: 'var(--ink)',
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.75, marginBottom: 2 }}>🥇 1ST</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>BuildASoil 3.0</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #c0c0c0 0%, #8a8a8a 100%)',
                color: 'var(--ink)',
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.75, marginBottom: 2 }}>🥈 2ND</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>BuildASoil Light</div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'rgba(247, 243, 234, 0.75)', lineHeight: 1.5, marginBottom: 20 }}>
              Side-by-side hemp grow comparing 11 bagged soils across a full season.
              Includes Fox Farm Ocean Forest, Coast of Maine Stonington, Pro-Mix BK25,
              Soil King Big Rootz, and others.
            </div>

            <a
              href={SOIL_WARS_URL}
              target="_blank"
              rel="noopener"
              style={{
                color: '#d4a557',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              ▶ Watch all 21 episodes →
            </a>
          </div>

          {/* --- Test 2: Know Before You Grow 26-bag test --- */}
          <div style={{
            background: 'rgba(247, 243, 234, 0.04)',
            border: '1px solid rgba(212, 165, 87, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 28px 24px',
          }}>
            <div style={{
              fontSize: '0.72rem',
              color: '#d4a557',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
              marginBottom: 8,
            }}>
              Test 2 · Retail-purchased, lab-tested
            </div>
            <h3 style={{ color: 'var(--bg-paper)', fontSize: '1.4rem', marginBottom: 8 }}>
              26-Bag Bagged-Soil Ranking
            </h3>
            <div style={{ color: 'rgba(247, 243, 234, 0.65)', fontSize: '0.88rem', marginBottom: 16 }}>
              by Know Before You Grow
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #d4a557 0%, #b8893f 100%)',
              color: 'var(--ink)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.75, marginBottom: 2 }}>🥇 RANKED #1 OF 26</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>BuildASoil 3.0</div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginBottom: 16,
            }}>
              {['🧪 Soil Test', '🌱 Nutrients', '🌿 Grow-Out', '🍃 Taste'].map((label) => (
                <div key={label} style={{
                  background: 'rgba(247, 243, 234, 0.05)',
                  border: '1px solid rgba(247, 243, 234, 0.1)',
                  borderRadius: 6,
                  padding: '8px 6px',
                  fontSize: '0.72rem',
                  color: 'rgba(247, 243, 234, 0.85)',
                  textAlign: 'center',
                  fontWeight: 500,
                }}>
                  {label}
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'rgba(247, 243, 234, 0.75)', lineHeight: 1.5, marginBottom: 20 }}>
              26 bagged soils purchased at retail and ranked across 4 scoring categories
              including lab soil testing. The reviewer didn&rsquo;t take payment from any
              brand. Includes Fox Farm, Coast of Maine, Soil King, and 23 others.
            </div>

            <a
              href={KNOW_BEFORE_URL}
              target="_blank"
              rel="noopener"
              style={{
                color: '#d4a557',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              See the full ranking →
            </a>
          </div>
        </div>

        <div style={{
          background: 'rgba(212, 165, 87, 0.08)',
          border: '1px solid rgba(212, 165, 87, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          fontSize: '0.92rem',
          color: 'rgba(247, 243, 234, 0.9)',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: '#d4a557' }}>Two tests beat Fox Farm Ocean Forest and Coast of Maine Stonington.</strong>
          {' '}Both competitors were in both lineups. Both lost to BuildASoil in both
          independent tests. That&rsquo;s a pattern, not a fluke.
        </div>
      </div>
    </section>
  );
}
