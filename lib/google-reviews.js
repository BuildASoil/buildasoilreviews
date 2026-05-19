// lib/google-reviews.js
// Server-side Google Places API integration.
// Uses the new Places API (Places API v2 / New) for current support.
//
// Required env vars:
//   GOOGLE_PLACES_API_KEY - your Google Cloud API key with Places API enabled
//   GOOGLE_PLACE_ID       - your Google Business Profile Place ID
//
// We cache the response in-memory for a configurable TTL (default 1 hour)
// so we don't hit Google on every page request. Vercel restarts every deploy
// so this stays fresh.

const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let _cache = { data: null, fetchedAt: 0 };

async function getGoogleReviews() {
  // If credentials are missing, return null gracefully (homepage will hide section)
  if (!PLACE_ID || !API_KEY) {
    return null;
  }

  const now = Date.now();
  if (_cache.data && now - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.data;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}`;
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri,websiteUri',
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('Google Places API error:', res.status, errText);
      return null;
    }

    const data = await res.json();

    const normalized = {
      name: 'Google',
      displayName: data.displayName?.text || 'BuildASoil',
      rating: typeof data.rating === 'number' ? data.rating : null,
      reviewCount: typeof data.userRatingCount === 'number' ? data.userRatingCount : null,
      url: data.googleMapsUri || null,
      scale: 5,
      brandColor: '#4285f4',
      reviews: Array.isArray(data.reviews)
        ? data.reviews.map((r) => ({
            author: r.authorAttribution?.displayName || 'Google user',
            authorPhoto: r.authorAttribution?.photoUri || null,
            rating: r.rating || null,
            text: r.text?.text || r.originalText?.text || '',
            relativeTime: r.relativePublishTimeDescription || '',
            publishTime: r.publishTime || null,
          }))
        : [],
    };

    _cache = { data: normalized, fetchedAt: now };
    return normalized;
  } catch (err) {
    console.warn('Google Places API fetch failed:', err.message);
    return null;
  }
}

module.exports = { getGoogleReviews };
