// lib/media.js
// Helpers for extracting and resizing customer photos from Okendo review media.
//
// Each review's media_json column contains a JSON array of Okendo media objects.
// We extract image URLs and let the consumer request thumbnails at custom sizes
// via Okendo's resize query parameter (?d=WIDTHxHEIGHT).

/**
 * Parse media_json from a review row into an array of image objects.
 * Returns [] if no media or invalid JSON.
 */
function parseMedia(mediaJson) {
  if (!mediaJson) return [];
  try {
    const arr = JSON.parse(mediaJson);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((m) => {
        // Okendo media objects vary — try a few known shapes
        const url = m.url || m.src || m.thumbnailUrl || m.fullUrl || null;
        const type = m.type || m.mediaType || 'image';
        const id = m.mediaId || m.id || null;
        if (!url) return null;
        // Only return images (skip videos for now)
        if (type && !String(type).toLowerCase().includes('image')) return null;
        return { url, id, type };
      })
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

/**
 * Take an Okendo image URL and return a resized version.
 * Okendo URLs use ?d=WIDTHxHEIGHT for on-the-fly resizing.
 */
function resize(url, size) {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('d', size);
    return u.toString();
  } catch (e) {
    // Not a valid URL — return as-is
    return url;
  }
}

/**
 * Common preset sizes
 */
const SIZES = {
  thumb: '200x200',   // small thumbnail in review cards
  card: '600x600',    // medium for homepage gallery grid
  full: '1600x1600',  // for lightbox
};

/**
 * Pull all images out of a review row, with preset sizes.
 * Returns an array of { thumb, card, full, id } objects.
 */
function getReviewImages(review) {
  const media = parseMedia(review.media_json);
  return media.map((m) => ({
    id: m.id,
    thumb: resize(m.url, SIZES.thumb),
    card: resize(m.url, SIZES.card),
    full: resize(m.url, SIZES.full),
  }));
}

module.exports = { parseMedia, resize, getReviewImages, SIZES };
