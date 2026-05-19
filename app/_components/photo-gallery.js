// app/_components/photo-gallery.js
// "Real customer grows" section for the homepage.
// Pulls a curated set of photo reviews and displays them in a grid.

const { rows } = require('../../lib/db');
const { getReviewImages } = require('../../lib/media');

export default async function PhotoGallery({ count = 12 }) {
  // Pull recent photo reviews with substantive body text
  const photoReviews = await rows(`
    SELECT review_id, reviewer_name, product_name, body, rating, media_json
    FROM reviews
    WHERE has_media = 1
      AND rating >= 4
      AND body IS NOT NULL
      AND length(body) > 60
    ORDER BY date_created DESC
    LIMIT 60
  `);

  // For each review, take its first image
  const tiles = [];
  for (const r of photoReviews) {
    const images = getReviewImages(r);
    if (images.length === 0) continue;
    tiles.push({
      image: images[0],
      reviewer: r.reviewer_name,
      product: r.product_name,
      rating: r.rating,
    });
    if (tiles.length >= count) break;
  }

  if (tiles.length === 0) return null;

  return (
    <section className="section" style={{ background: 'var(--bg-paper)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Real customer grows</h2>
            <p className="head-meta" style={{ marginTop: 8 }}>
              Photos submitted by verified BuildASoil customers with their reviews.
            </p>
          </div>
          <a href="/reviews?photos=1" className="section-link">See all photo reviews →</a>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
          }}
          className="photo-gallery-grid"
        >
          {tiles.map((t, i) => (
            <a
              key={i}
              href={`/reviews?q=${encodeURIComponent(t.product || '')}&photos=1`}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--cream)',
                display: 'block',
                position: 'relative',
              }}
              className="photo-tile-link"
              aria-label={`Photo from ${t.reviewer || 'a customer'}`}
            >
              <img
                src={t.image.card}
                alt=""
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s ease',
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
