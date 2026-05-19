// lib/shopify.js
// Fetches the list of CURRENTLY ACTIVE products from buildasoil.com
// using Shopify's public /products.json endpoint (no auth required).
//
// Used to filter the review site to only show products that are still for sale.

const SHOPIFY_BASE = 'https://buildasoil.com';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let _cache = { data: null, fetchedAt: 0 };

/**
 * Fetches all active products from Shopify.
 * Returns an array of normalized product objects, or null on failure.
 * Caches results in-memory for an hour to avoid hammering Shopify.
 */
async function getActiveProducts() {
  const now = Date.now();
  if (_cache.data && now - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.data;
  }

  try {
    const all = [];
    let page = 1;
    // Shopify caps at 250 per page; loop until we get fewer than 250 back
    while (true) {
      const url = `${SHOPIFY_BASE}/products.json?limit=250&page=${page}`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        // Important: pass a User-Agent so Shopify doesn't block us
        // (Vercel's default fetch may not include one)
      });
      if (!res.ok) {
        console.warn(`Shopify products.json error: ${res.status}`);
        break;
      }
      const data = await res.json();
      const products = Array.isArray(data.products) ? data.products : [];
      if (products.length === 0) break;
      all.push(...products);
      if (products.length < 250) break;
      page++;
      if (page > 20) break; // safety: max 5000 products
    }

    // Normalize: pull out just what we need
    const normalized = all.map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle, // e.g., "buildasoil-potting-soil-recipe-3-0"
      url: `${SHOPIFY_BASE}/products/${p.handle}`,
      productType: p.product_type || '',
      vendor: p.vendor || '',
      tags: Array.isArray(p.tags) ? p.tags : [],
      publishedAt: p.published_at,
      // First image, if any
      image: Array.isArray(p.images) && p.images.length > 0
        ? { src: p.images[0].src, alt: p.images[0].alt || p.title }
        : null,
      // Lowest variant price (for display, if we ever want it)
      priceMin: Array.isArray(p.variants) && p.variants.length > 0
        ? Math.min(...p.variants.map((v) => parseFloat(v.price)).filter((n) => !isNaN(n)))
        : null,
    }));

    _cache = { data: normalized, fetchedAt: now };
    return normalized;
  } catch (err) {
    console.warn('Failed to fetch Shopify products:', err.message);
    return null;
  }
}

/**
 * Returns a Set of normalized product titles that are currently active.
 * Used for fast lookup when filtering the review database.
 */
async function getActiveProductTitlesSet() {
  const products = await getActiveProducts();
  if (!products) return null;
  return new Set(products.map((p) => normalizeName(p.title)));
}

/**
 * Returns a Map of normalized title -> shopify product object.
 */
async function getActiveProductMap() {
  const products = await getActiveProducts();
  if (!products) return null;
  const map = new Map();
  for (const p of products) {
    map.set(normalizeName(p.title), p);
  }
  return map;
}

/**
 * Normalize a product name for matching between Shopify and Okendo.
 * They sometimes differ in whitespace, punctuation, casing.
 */
function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Check if a given review product_name corresponds to an active Shopify product.
 */
async function isActiveProduct(reviewProductName) {
  const set = await getActiveProductTitlesSet();
  if (!set) return true; // If we can't reach Shopify, fail open (show everything)
  return set.has(normalizeName(reviewProductName));
}

module.exports = {
  getActiveProducts,
  getActiveProductTitlesSet,
  getActiveProductMap,
  isActiveProduct,
  normalizeName,
};
