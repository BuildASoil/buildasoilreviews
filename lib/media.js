// lib/media.js
// Parse and format customer review photos from Okendo.
//
// Okendo media_json items look like:
// {
//   "alt": "...alt text...",
//   "type": "image",
//   "dynamicKey": "USER_ID/IMAGE_ID",
//   "fullSizeUrl": "..._full_size.jpg",
//   "largeUrl": "..._large.jpg",
//   "largePortraitThumbnailUrl": "..._thumbnail_portrait_large.jpg",
//   "thumbnailUrl": "..._thumbnail_120_120.jpg",
//   "streamId": "IMAGE_ID",
//   "isHidden": false
// }
//
// We expose 3 sizes for convenience: thumb, card, full.

/**
 * Parse media_json from a review row into an array of image objects.
 * Each image has { id, alt, thumb, card, full }.
 *
 *   thumb -> Okendo's 120x120 thumbnail (small strip in review cards)
 *   card  -> Okendo's "large" variant (homepage gallery, medium previews)
 *   full  -> Okendo's full-size original (lightbox)
 *
 * Filters out hidden media and non-images.
 */
function parseMedia(mediaJson) {
  if (!mediaJson) return [];
  try {
    const arr = JSON.parse(mediaJson);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((m) => {
        if (!m) return false;
        if (m.isHidden) return false;
        const type = String(m.type || 'image').toLowerCase();
        if (type.includes('video')) return false; // skip videos for now
        return true;
      })
      .map((m) => {
        // Prefer the specific named variants Okendo provides
        const thumb = m.thumbnailUrl || m.largeUrl || m.fullSizeUrl || null;
        const card = m.largeUrl || m.fullSizeUrl || m.thumbnailUrl || null;
        const full = m.fullSizeUrl || m.largeUrl || m.thumbnailUrl || null;
        if (!thumb && !card && !full) return null;
        return {
          id: m.streamId || m.dynamicKey || null,
          alt: m.alt || '',
          thumb,
          card,
          full,
        };
      })
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

/**
 * Convenience: pull images out of a review row.
 */
function getReviewImages(review) {
  return parseMedia(review && review.media_json);
}

module.exports = { parseMedia, getReviewImages };
