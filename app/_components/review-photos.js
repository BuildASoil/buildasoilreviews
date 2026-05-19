// app/_components/review-photos.js
'use client';

import { useState, useEffect } from 'react';

/**
 * Renders a horizontal strip of review photo thumbnails.
 * Clicking a thumbnail opens a lightbox.
 *
 * Props:
 *   images: array of { id, thumb, card, full } from lib/media.js
 *   reviewer: optional name for accessibility
 */
export default function ReviewPhotos({ images, reviewer }) {
  const [openIndex, setOpenIndex] = useState(null);

  // Close on ESC, navigate with arrows
  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e) {
      if (e.key === 'Escape') setOpenIndex(null);
      else if (e.key === 'ArrowRight') setOpenIndex((i) => Math.min(images.length - 1, i + 1));
      else if (e.key === 'ArrowLeft') setOpenIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, images.length]);

  if (!images || images.length === 0) return null;

  // Limit visible thumbnails; show "+X more" on the last tile if exceeded
  const MAX_VISIBLE = 4;
  const visible = images.slice(0, MAX_VISIBLE);
  const remaining = images.length - MAX_VISIBLE;

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 12,
          flexWrap: 'wrap',
        }}
      >
        {visible.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setOpenIndex(i)}
            aria-label={`View photo ${i + 1}${reviewer ? ` from ${reviewer}` : ''}`}
            style={{
              width: 84,
              height: 84,
              padding: 0,
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'var(--cream)',
              position: 'relative',
            }}
          >
            <img
              src={img.thumb}
              alt=""
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {i === MAX_VISIBLE - 1 && remaining > 0 ? (
              <span
                onClick={(e) => { e.stopPropagation(); setOpenIndex(i); }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(31, 26, 20, 0.6)',
                  color: 'var(--bg-paper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                +{remaining}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(31, 26, 20, 0.92)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIndex(null); }}
            aria-label="Close"
            style={{
              position: 'fixed',
              top: 20,
              right: 24,
              background: 'transparent',
              color: 'var(--bg-paper)',
              fontSize: '2rem',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 8,
            }}
          >
            ×
          </button>
          {openIndex > 0 ? (
            <button
              onClick={(e) => { e.stopPropagation(); setOpenIndex(openIndex - 1); }}
              aria-label="Previous photo"
              style={{
                position: 'fixed',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                color: 'var(--bg-paper)',
                fontSize: '1.6rem',
                cursor: 'pointer',
                width: 48,
                height: 48,
                borderRadius: '50%',
                lineHeight: 1,
              }}
            >
              ‹
            </button>
          ) : null}
          {openIndex < images.length - 1 ? (
            <button
              onClick={(e) => { e.stopPropagation(); setOpenIndex(openIndex + 1); }}
              aria-label="Next photo"
              style={{
                position: 'fixed',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                color: 'var(--bg-paper)',
                fontSize: '1.6rem',
                cursor: 'pointer',
                width: 48,
                height: 48,
                borderRadius: '50%',
                lineHeight: 1,
              }}
            >
              ›
            </button>
          ) : null}
          <img
            src={images[openIndex].full}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem',
            }}
          >
            {openIndex + 1} / {images.length}
          </div>
        </div>
      ) : null}
    </>
  );
}
