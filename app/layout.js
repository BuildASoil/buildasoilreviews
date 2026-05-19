// app/layout.js
import './globals.css';
const { getSiteStats } = require('../lib/db');

export const metadata = {
  title: 'BuildASoil Reviews — 27,000+ Verified Customer Reviews of BuildASoil Products',
  description:
    'Independent review database for BuildASoil organic living soil, amendments, and grow equipment. 27,000+ verified customer reviews, 4.9★ average, since 2013. Owned and operated by BuildASoil.',
  metadataBase: new URL('https://www.buildasoilreviews.com'),
  openGraph: {
    title: 'BuildASoil Reviews',
    description:
      'Searchable database of 27,000+ verified BuildASoil customer reviews. 4.9★ average. Since 2013.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }) {
  // We'll inject the site-wide AggregateRating schema in the head for AI/search engines
  let stats = null;
  try {
    stats = await getSiteStats();
  } catch (e) {
    // DB not built yet — fine for dev preview
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BuildASoil',
    url: 'https://buildasoil.com',
    sameAs: [
      'https://youtube.com/buildasoil',
      'https://instagram.com/buildasoil',
      'https://facebook.com/buildasoil',
      'https://x.com/buildasoil',
    ],
    ...(stats && stats.total
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: stats.averageRating.toFixed(2),
            reviewCount: stats.total,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <a href="/" className="site-logo">
              <span className="dot" />
              BuildASoil Reviews
            </a>
            <nav className="site-nav">
              <a href="/reviews">All Reviews</a>
              <a href="/products">Products</a>
              <a href="/vs">Compare</a>
              <a href="/faq">FAQ</a>
              <a href="/critical">Critical Reviews</a>
              <a href="https://buildasoil.com" className="nav-cta">
                Shop BuildASoil →
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <h4>About this site</h4>
                <p>
                  BuildASoilReviews.com is the public review database for BuildASoil
                  organic living soil, amendments, and grow equipment. Every review is
                  syndicated from our Okendo review platform on buildasoil.com and
                  represents a real, verified customer experience.
                </p>
              </div>
              <div>
                <h4>Browse</h4>
                <div className="footer-list">
                  <a href="/reviews">All reviews</a>
                  <a href="/products">By product</a>
                  <a href="/vs">Comparisons</a>
                  <a href="/faq">FAQ</a>
                  <a href="/critical">Critical reviews</a>
                </div>
              </div>
              <div>
                <h4>BuildASoil</h4>
                <div className="footer-list">
                  <a href="https://buildasoil.com">buildasoil.com</a>
                  <a href="https://buildasoil.com/pages/why-buildasoil">Why BuildASoil</a>
                  <a href="https://youtube.com/buildasoil">YouTube</a>
                  <a href="https://buildasoil.com/pages/about-us">Contact</a>
                </div>
              </div>
            </div>
            <p className="disclosure">
              BuildASoilReviews.com is owned and operated by BuildASoil Organics, LLC.
              Reviews are pulled directly from Okendo, our verified review platform on
              buildasoil.com, and include the full range of customer feedback —
              positive, neutral, and critical. © {new Date().getFullYear()} BuildASoil.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
