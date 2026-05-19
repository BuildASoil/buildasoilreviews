// app/sitemap.js
const { rows, slugify } = require('../lib/db');
const { competitors } = require('../lib/competitors');
const { getActiveProductTitlesSet, normalizeName } = require('../lib/shopify');

export default async function sitemap() {
  const base = 'https://www.buildasoilreviews.com';

  // Get all products that have a page
  const products = await rows(`
    SELECT product_name, MAX(date_created) AS last_review
    FROM reviews WHERE product_name IS NOT NULL
    GROUP BY product_name HAVING COUNT(*) >= 3
  `);

  // Filter to only active Shopify products (so we don't serve dead links to search engines)
  const activeSet = await getActiveProductTitlesSet();
  const filteredProducts = activeSet
    ? products.filter((p) => activeSet.has(normalizeName(p.product_name)))
    : products;

  const productUrls = filteredProducts.map((p) => ({
    url: `${base}/products/${slugify(p.product_name)}`,
    lastModified: p.last_review ? new Date(p.last_review) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Comparison pages
  const vsUrls = Object.keys(competitors).map((slug) => ({
    url: `${base}/vs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/reviews`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/vs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/critical`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...vsUrls,
    ...productUrls,
  ];
}
