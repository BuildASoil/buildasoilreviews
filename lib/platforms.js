// lib/platforms.js
// Cross-platform review aggregation. Update Trustpilot numbers manually
// (they change rarely at your volume). Google numbers come from the API.

const TRUSTPILOT = {
  name: 'Trustpilot',
  // EDIT THESE when your Trustpilot numbers change meaningfully:
  rating: 4.5,       // <-- replace with your real TrustScore
  reviewCount: 95,   // <-- replace with your real review count
  // ----------------------------------------------------------
  url: 'https://www.trustpilot.com/review/buildasoil.com',
  scale: 5,
  brandColor: '#00b67a', // Trustpilot green
};

// Google data comes from a server-side fetch (see lib/google-reviews.js).
// We expose only a fallback here in case the API call fails or hasn't been
// configured yet.
const GOOGLE_FALLBACK = {
  name: 'Google',
  rating: null,         // will be filled in by API
  reviewCount: null,    // will be filled in by API
  url: null,            // will be filled in by API (your Google Maps URL)
  scale: 5,
  brandColor: '#4285f4',
};

module.exports = { TRUSTPILOT, GOOGLE_FALLBACK };
