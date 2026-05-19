# BuildASoilReviews.com

The AI-optimized, multi-platform review intelligence hub for BuildASoil.

## What's included

- **Homepage** with hero stats, "Trusted across platforms" section, themes, top products, FAQ, comparisons callout, critical reviews block, recent reviews
- **Searchable reviews database** at `/reviews` — every review filterable by rating, photos, keyword
- **Per-product pages** at `/products/[slug]` — auto-generated for every product with 3+ reviews
- **Comparison pages** at `/vs/[competitor]` — honest side-by-side with Fox Farm Ocean Forest, Happy Frog, Roots Organics, Coast of Maine Stonington
- **FAQ page** at `/faq` — AI citation magnet with 11 data-backed answers
- **Critical reviews page** at `/critical` — 1, 2, 3-star reviews with the "we've grown" message
- **Cross-platform integration** — Okendo (live), Trustpilot (manual numbers), Google (live via Places API)
- **AI infrastructure** — robots.txt allowing all AI bots, llms.txt, full JSON-LD schema markup, sitemap

---

## First-time setup (Windows)

### 1. Install dependencies

In PowerShell, inside the project folder:

```powershell
npm install --legacy-peer-deps
```

### 2. Set up credentials

```powershell
copy .env.example .env
notepad .env
```

Fill in the values (see `.env.example` for what's needed). Save.

### 3. Pull reviews from Okendo

```powershell
npm run sync
```

This pulls every review from your Okendo account into a local SQLite database. Takes 5-10 minutes the first time. Safe to re-run.

### 4. (Optional) Update Trustpilot numbers

Open `lib/platforms.js` in Notepad. Update the `rating` and `reviewCount` values to your current Trustpilot numbers. Save.

### 5. Start the site

```powershell
npm run dev
```

Open http://localhost:3000

---

## Scripts

- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — production build (also pre-renders all product pages)
- `npm run start` — run the production build
- `npm run sync` — pull latest reviews from Okendo
- `npm run stats` — print summary of your review data

To resume an interrupted sync (pick up where you left off, going backwards in time):

```powershell
$env:RESUME=1; npm run sync
```

---

## Project structure

```
buildasoil-reviews/
├── .env                       ← your secrets (gitignored — never commit)
├── .env.example               ← template
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── app/                       ← Next.js pages
│   ├── page.js                ← Homepage
│   ├── layout.js              ← Header, footer, site-wide schema
│   ├── globals.css            ← All styles
│   ├── sitemap.js             ← Auto-generated sitemap.xml
│   ├── _components/
│   │   └── platforms-section.js   ← Cross-platform "Trusted" section
│   ├── reviews/page.js        ← Searchable reviews
│   ├── products/page.js       ← All products listing
│   ├── products/[slug]/page.js ← Per-product pages
│   ├── vs/page.js             ← Comparison hub
│   ├── vs/[competitor]/page.js ← Individual comparisons
│   ├── faq/page.js            ← FAQ
│   └── critical/page.js       ← Critical reviews + improvement message
├── lib/                       ← Shared code
│   ├── db.js                  ← SQLite access helpers
│   ├── competitors.js         ← Competitor comparison data
│   ├── platforms.js           ← Trustpilot static config
│   └── google-reviews.js      ← Google Places API client
├── public/
│   ├── robots.txt             ← All AI bots allowed
│   ├── llms.txt               ← AI-specific site description
│   └── favicon.svg
├── scripts/
│   ├── sync-okendo.js         ← Pulls reviews from Okendo
│   └── show-stats.js          ← Prints summary stats
└── data/
    └── reviews.db             ← SQLite database (gitignored)
```

---

## Deployment

When ready to go live on www.buildasoilreviews.com:

1. **Push to GitHub** — create a private repo and push the project
2. **Connect Vercel to the repo** at vercel.com
3. **Add environment variables** in Vercel project settings:
   - `OKENDO_USER_ID`
   - `OKENDO_API_KEY`
   - `GOOGLE_PLACES_API_KEY` (optional)
   - `GOOGLE_PLACE_ID` (optional)
4. **Point DNS** — at your domain registrar, point www.buildasoilreviews.com at Vercel
5. **Set up nightly sync** — add a Vercel Cron Job to run the sync script daily

---

## SEO / AI checklist

Every page has:
- Proper meta title and description
- Open Graph tags via layout
- JSON-LD structured data (Organization, AggregateRating, FAQPage, Product, Review)
- Mobile-responsive

Site-wide:
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, etc.
- `llms.txt` describes the site to AI crawlers
- Auto-generated `sitemap.xml` includes every product and comparison page
- Server-side rendering (AI crawlers don't always execute JavaScript)
