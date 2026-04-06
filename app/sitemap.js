import { getAllNeighborhoods, getAllCities, getAllCountries, neighborhoodSlug, toSlug } from '../lib/neighborhood-db';
import { getAllPosts } from '../lib/blog-data';

const BASE = 'https://www.50bestneighborhoods.com';

export default function sitemap() {
  const now = new Date().toISOString();
  const entries = [
    { url: BASE, lastModified: now, priority: 1.0 },
    { url: `${BASE}/top-50`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/cities`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/countries`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, priority: 0.5 },
  ];
  for (const p of getAllPosts()) {
    entries.push({ url: `${BASE}/blog/${p.slug}`, lastModified: p.date, priority: 0.6 });
  }
  for (const n of getAllNeighborhoods()) {
    entries.push({ url: `${BASE}/neighborhood/${neighborhoodSlug(n)}`, lastModified: now, priority: 0.8 });
  }
  for (const c of getAllCities()) {
    entries.push({ url: `${BASE}/city/${toSlug(c.name)}`, lastModified: now, priority: 0.7 });
  }
  for (const c of getAllCountries()) {
    entries.push({ url: `${BASE}/country/${toSlug(c.name)}`, lastModified: now, priority: 0.6 });
  }
  return entries;
}
