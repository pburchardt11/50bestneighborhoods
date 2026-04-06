# 50 Best Neighborhoods

Editorial reference guide to the world's greatest city districts. Part of the 50 Best family.

## Stack
- Next.js 14 (App Router)
- React 18
- Tailwind CSS (utility base) + inline-style editorial design system
- Vercel Analytics
- Deployed on Vercel

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Flagship dataset: **20 cities × 5 neighborhoods** (100 entries), each with an editorial blurb and 3 source publications.
See `lib/neighborhood-data.js`.

City and country intros live in `lib/content.js`.

Query helpers (slugs, top-50, by-city, by-country) live in `lib/neighborhood-db.js`.

## Routes

- `/` — Homepage (hero, top 50, cities, countries)
- `/top-50` — Global ranking
- `/city/[slug]` — City guide with 5 neighborhoods
- `/country/[slug]` — All cities/neighborhoods in a country
- `/neighborhood/[slug]` — Detail page with editorial sources
- `/cities`, `/countries` — Index pages
- `/about`, `/privacy`, `/contact` — Static pages
- `/sitemap.xml`, `/robots.txt` — SEO

## Expanding

To add a new city, append 5 entries to `NEIGHBORHOODS` in `lib/neighborhood-data.js` and (optionally) add a city intro in `lib/content.js`. The data layer, routes, and sitemap pick it up automatically.

## Deployment

```bash
vercel link
vercel --prod
```

Then point `50bestneighborhoods.com` DNS (GoDaddy) at Vercel per the instructions in the dashboard.
