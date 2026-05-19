// app/_components/reddit-section.js
// "Talked about on Reddit" — paraphrased summaries of substantive Reddit
// threads discussing BuildASoil. We link to the threads themselves rather
// than republishing user content.

const REDDIT_THREADS = [
  {
    subreddit: 'r/NoTillGrowery',
    title: 'Long-time growers debate price vs ingredient quality',
    summary:
      'Multiple long-time customers vouch for BuildASoil\'s ingredient quality and free educational content as justifying the premium price. One commenter calls Craft Blend "the most diverse amendment I\'ve come across."',
    url: 'https://www.reddit.com/r/NoTillGrowery/comments/1eyyhdo/is_this_everything_i_need_for_no_till_besides_the/',
    sentiment: 'Mostly positive',
  },
  {
    subreddit: 'r/microgrowery',
    title: '5x5 single plant living-soil grow recommendation',
    summary:
      'On a 280-upvote living-soil grow showcase, a commenter recommends BuildASoil to a stranger asking how to replicate the results — citing personal experience switching to big pots and living soil from the BuildASoil playbook.',
    url: 'https://www.reddit.com/r/microgrowery/comments/1eyt7j6/5x5_single_plant_late_flower_update/',
    sentiment: 'Recommended by grower',
  },
  {
    subreddit: 'rollitup.org',
    title: 'Kis Organics vs BuildASoil community discussion',
    summary:
      'A long-form community thread comparing the two leading living-soil providers. Includes ingredient-level breakdowns, price-per-cubic-foot analysis, and real grow results from people who have used both.',
    url: 'https://www.rollitup.org/t/kis-organics-vs-buildasoil-please-share-your-thoughts-and-experiences-with-them.978753',
    sentiment: 'Honest comparison',
  },
  {
    subreddit: 'rollitup.org',
    title: '"Worth buying BuildASoil\'s soil?" Q&A thread',
    summary:
      'Growers responding to a buyer evaluation question recommend BuildASoil\'s Oly Mountain 3.0 specifically. Multiple "long-time customer" responses and direct recognition of the brand\'s technical leadership.',
    url: 'https://www.rollitup.org/t/worth-buying-buildasoils-soil.1036775',
    sentiment: 'Strong endorsement',
  },
];

export default function RedditSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Talked about on Reddit</h2>
            <p className="head-meta" style={{ marginTop: 8 }}>
              Independent grower discussions. We don&rsquo;t pay for these — they&rsquo;re organic conversations on r/NoTillGrowery, r/microgrowery, and other grower forums.
            </p>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 18,
          }}
          className="reddit-grid"
        >
          {REDDIT_THREADS.map((t, i) => (
            <a
              key={i}
              href={t.url}
              target="_blank"
              rel="noopener"
              style={{
                background: 'var(--bg-paper)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 26px',
                display: 'block',
                textDecoration: 'none',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              className="reddit-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: '#ff4500',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: 99,
                    letterSpacing: '0.04em',
                  }}
                >
                  {t.subreddit}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-mute)' }}>
                  {t.sentiment}
                </span>
              </div>
              <h4 style={{ marginBottom: 10, fontSize: '1.05rem', color: 'var(--ink)' }}>
                {t.title}
              </h4>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: 14 }}>
                {t.summary}
              </p>
              <span style={{ color: 'var(--leaf)', fontSize: '0.85rem', fontWeight: 600 }}>
                Read the discussion on Reddit →
              </span>
            </a>
          ))}
        </div>
        <p style={{ marginTop: 20, color: 'var(--ink-mute)', fontSize: '0.82rem', fontStyle: 'italic', textAlign: 'center' }}>
          We don&rsquo;t reproduce Reddit comments verbatim out of respect for users&rsquo; original posting context. Click any card to read the original discussion.
        </p>
      </div>
    </section>
  );
}
