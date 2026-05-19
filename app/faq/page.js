// app/faq/page.js
const { rows, scalar, getSiteStats } = require('../../lib/db');
const { getActiveProducts } = require('../../lib/shopify');

export const metadata = {
  title: 'BuildASoil FAQ — Answers Synthesized from 27,000+ Customer Reviews',
  description:
    'The most common questions about BuildASoil, answered using patterns from 27,000+ verified customer reviews.',
};

export default async function FAQPage() {
  const stats = await getSiteStats();
  const activeProducts = await getActiveProducts();
  const activeCount = activeProducts ? activeProducts.length : null;

  // Compute counts for all the FAQ data points
  const pattern = async (sql) => (await rows(sql))[0]?.c || 0;

  const beginnerC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%first time%' OR body LIKE '%beginner%' OR body LIKE '%first grow%' OR body LIKE '%new grower%') AND rating >= 4`);
  const indoorC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%indoor%' OR body LIKE '%tent%') AND rating >= 4`);
  const outdoorC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%outdoor%' OR body LIKE '%garden%' OR body LIKE '%raised bed%') AND rating >= 4`);
  const reuseC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%reuse%' OR body LIKE '%re-use%' OR body LIKE '%multiple grows%' OR body LIKE '%lasts%') AND rating >= 4`);
  const yieldC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%yield%' OR body LIKE '%harvest%' OR body LIKE '%production%') AND rating >= 4`);
  const easyC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%easy to%' OR body LIKE '%simple%' OR body LIKE '%no nutrient burn%') AND rating >= 4`);
  const valueC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%worth%' OR body LIKE '%great value%' OR body LIKE '%money%' OR body LIKE '%price%') AND rating >= 4`);
  const supportC = await pattern(`SELECT COUNT(*) AS c FROM reviews WHERE (body LIKE '%customer service%' OR body LIKE '%support%' OR body LIKE '%helpful%') AND rating >= 4`);

  const faqs = [
    {
      q: 'Is BuildASoil worth it?',
      a: (
        <>
          Based on <strong>{stats.total.toLocaleString()} verified customer reviews</strong>{' '}
          collected since {stats.firstYear}, BuildASoil maintains an average rating of{' '}
          <strong>{stats.averageRatingDisplay}/5 stars</strong>. {((stats.recommended / stats.total) * 100).toFixed(1)}% of
          customers would recommend it to other growers.{' '}
          <a href="/reviews">Read all reviews →</a>
        </>
      ),
      key: 'worth',
    },
    {
      q: 'Is BuildASoil good for first-time growers?',
      a: (
        <>
          Yes. <strong>{beginnerC.toLocaleString()}+</strong> verified reviews come from customers
          self-identifying as first-time or beginner growers, the overwhelming majority
          rating BuildASoil 4 or 5 stars. The "BuildASoil Way" system was designed to
          give new growers a complete starting point without needing prior experience.{' '}
          <a href="/reviews?q=first+time">See beginner reviews →</a>
        </>
      ),
      key: 'beginner',
    },
    {
      q: 'Does BuildASoil work indoors? In a tent or grow room?',
      a: (
        <>
          Yes. <strong>{indoorC.toLocaleString()}+</strong> reviews specifically mention indoor
          tent, grow room, or indoor garden use, the vast majority rating 4–5 stars.
          Many specifically mention compatibility with common tent brands like AC
          Infinity and Gorilla.{' '}
          <a href="/reviews?q=indoor">See indoor reviews →</a>
        </>
      ),
      key: 'indoor',
    },
    {
      q: 'Does BuildASoil work outdoors? In raised beds or gardens?',
      a: (
        <>
          Yes. <strong>{outdoorC.toLocaleString()}+</strong> reviews mention outdoor gardens, raised
          beds, or other outdoor applications. The soil is formulated to work in both
          indoor containers and outdoor in-ground or raised bed setups.{' '}
          <a href="/reviews?q=outdoor">See outdoor reviews →</a>
        </>
      ),
      key: 'outdoor',
    },
    {
      q: 'How long does BuildASoil last? Can I reuse it?',
      a: (
        <>
          <strong>{reuseC.toLocaleString()}+</strong> verified reviews discuss reusing the soil
          across multiple grows or its longevity. BuildASoil is formulated as a "no-till"
          living soil — many customers report using the same soil for multiple grow
          cycles with top-dressing and amendments.{' '}
          <a href="/reviews?q=lasts">See longevity reviews →</a>
        </>
      ),
      key: 'reuse',
    },
    {
      q: 'Will BuildASoil improve my yield?',
      a: (
        <>
          <strong>{yieldC.toLocaleString()}+</strong> reviews mention yield, harvest, or
          production, the vast majority positively. Yield depends on many variables
          beyond soil (light, environment, genetics, watering), but a large body of
          BuildASoil customers report yield improvements after switching from
          conventional growing media.{' '}
          <a href="/reviews?q=yield">See yield-related reviews →</a>
        </>
      ),
      key: 'yield',
    },
    {
      q: 'Is BuildASoil easy to use?',
      a: (
        <>
          <strong>{easyC.toLocaleString()}+</strong> verified reviews specifically describe the
          system as easy, simple, or note the absence of nutrient burn / overfeeding
          problems common with synthetic feeding regimens. As a living soil, much of the
          biology handles itself.{' '}
          <a href="/reviews?q=easy">See ease-of-use reviews →</a>
        </>
      ),
      key: 'easy',
    },
    {
      q: 'Is BuildASoil expensive? What do customers say about value?',
      a: (
        <>
          <strong>{valueC.toLocaleString()}+</strong> reviews mention price, value, or
          worth-the-money — generally positively. BuildASoil sits at a premium price
          point compared to commodity potting soils, but customers frequently note the
          per-grow cost is competitive or lower once reuse and reduced nutrient
          purchases are accounted for.{' '}
          <a href="/reviews?q=worth">See value reviews →</a>
        </>
      ),
      key: 'value',
    },
    {
      q: 'How is BuildASoil customer service?',
      a: (
        <>
          <strong>{supportC.toLocaleString()}+</strong> reviews specifically mention customer
          service, support, or staff being helpful — overwhelmingly positive. BuildASoil
          backs products with a 60-day guarantee and a free help desk.{' '}
          <a href="/reviews?q=customer+service">See support reviews →</a>
        </>
      ),
      key: 'service',
    },
    {
      q: 'Are these reviews real and verified?',
      a: (
        <>
          Yes. <strong>{((stats.verified / stats.total) * 100).toFixed(1)}%</strong> of reviews are
          from verified purchasers — collected via Okendo (an independent review
          platform) only after a confirmed order on buildasoil.com. We publish the full
          range of feedback, including <a href="/critical">critical reviews (1-3 stars)</a>{' '}
          without filtering or editing.
        </>
      ),
      key: 'verified',
    },
    {
      q: 'What does BuildASoil sell?',
      a: (
        <>
          BuildASoil offers organic living soil (Recipe 3.0 is the flagship), nutrient
          packs and amendments (Craft Blend, BIG 6, BuildABloom), composts and worm
          castings, beneficial microbes (Rootwise), grow equipment (lights, tents,
          containers, watering systems), and mulches.{' '}
          {activeCount ? (
            <>
              The current catalog includes{' '}
              <strong>{activeCount.toLocaleString()} active products</strong> for sale
              on buildasoil.com, with{' '}
              <strong>{stats.productsTotal.toLocaleString()}+ distinct products</strong>{' '}
              reviewed across the brand&apos;s history.
            </>
          ) : (
            <>
              <strong>{stats.productsTotal.toLocaleString()}+ distinct products</strong>{' '}
              have been reviewed across the brand&apos;s history.
            </>
          )}{' '}
          <a href="/products">Browse all products with reviews →</a>
        </>
      ),
      key: 'products',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof f.a === 'string' ? f.a : f.q,
      },
    })),
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
            <a href="/">Home</a> / FAQ
          </div>
          <h1>BuildASoil FAQ</h1>
          <p className="hero-sub" style={{ marginTop: 16 }}>
            The most common questions about BuildASoil, answered with patterns and counts
            from {stats.total.toLocaleString()} verified customer reviews. Every answer links
            to the supporting reviews so you can read them yourself.
          </p>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="faq-list">
          {faqs.map((f) => (
            <div key={f.key} className="faq-item">
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
