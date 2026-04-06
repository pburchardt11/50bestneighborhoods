// scripts/fetch-neighborhoods.mjs
// Bulk-fetch Wikipedia summaries for every neighborhood in cities-seed.mjs.
// Wikipedia content is licensed CC BY-SA 4.0 — reuse is permitted with attribution,
// which the app renders on every neighborhood page and in the footer.
//
// Run with:  node scripts/fetch-neighborhoods.mjs
// Output:    lib/neighborhood-data.js  (overwrites)

import { CITIES } from './cities-seed.mjs';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'lib', 'neighborhood-data.js');

const UA = '50bestneighborhoods/1.0 (https://50bestneighborhoods.com; contact@50bestneighborhoods.com)';

// Fair-use editorial sources per-country (homepage-level, not article-level).
// These link to publication travel sections. The primary factual source is Wikipedia.
const EDITORIAL_POOLS = {
  default: [
    { pub: 'Time Out', url: 'https://www.timeout.com/' },
    { pub: 'Condé Nast Traveler', url: 'https://www.cntraveler.com/' },
    { pub: 'The Guardian Travel', url: 'https://www.theguardian.com/travel' },
  ],
  'United States': [
    { pub: 'Time Out', url: 'https://www.timeout.com/' },
    { pub: 'The New York Times Travel', url: 'https://www.nytimes.com/section/travel' },
    { pub: 'Condé Nast Traveler', url: 'https://www.cntraveler.com/' },
    { pub: 'Eater', url: 'https://www.eater.com/maps' },
  ],
  'United Kingdom': [
    { pub: 'Time Out London', url: 'https://www.timeout.com/london' },
    { pub: 'The Guardian Travel', url: 'https://www.theguardian.com/travel' },
    { pub: 'Condé Nast Traveller UK', url: 'https://www.cntraveller.com' },
  ],
  'France': [
    { pub: 'Time Out Paris', url: 'https://www.timeout.com/paris/en' },
    { pub: 'Condé Nast Traveler', url: 'https://www.cntraveler.com/' },
    { pub: 'Le Figaro Voyage', url: 'https://www.lefigaro.fr/voyages' },
  ],
  'Italy': [
    { pub: 'Time Out', url: 'https://www.timeout.com/' },
    { pub: 'La Repubblica Viaggi', url: 'https://www.repubblica.it/sezione/viaggi' },
    { pub: 'Condé Nast Traveler', url: 'https://www.cntraveler.com/' },
  ],
  'Germany': [
    { pub: 'Time Out', url: 'https://www.timeout.com/' },
    { pub: 'Der Tagesspiegel', url: 'https://www.tagesspiegel.de' },
    { pub: 'Condé Nast Traveler', url: 'https://www.cntraveler.com/' },
  ],
  'Japan': [
    { pub: 'Time Out Tokyo', url: 'https://www.timeout.com/tokyo' },
    { pub: 'The Japan Times', url: 'https://www.japantimes.co.jp/life/' },
    { pub: 'Condé Nast Traveler', url: 'https://www.cntraveler.com/' },
  ],
};

function sources(country) {
  return EDITORIAL_POOLS[country] || EDITORIAL_POOLS.default;
}

function toSlug(str) {
  return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchSummaryByTitle(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (!res.ok) return { ok: false, status: res.status };
    const json = await res.json();
    // Disambiguation pages are not what we want.
    if (json.type === 'disambiguation') return { ok: false, status: 'disambiguation' };
    return {
      ok: true,
      title: json.title,
      description: json.description || '',
      extract: json.extract || '',
      pageUrl: json.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`,
      thumbnail: json.thumbnail?.source || null,
      originalImage: json.originalimage?.source || null,
      coordinates: json.coordinates || null,
    };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// Fallback: search Wikipedia for a neighborhood when the curated title fails.
async function searchResolve(name, city, country) {
  const q = `${name} ${city} neighborhood`;
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=3&format=json&origin=*`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const json = await res.json();
    const hits = json?.query?.search || [];
    if (hits.length === 0) return null;
    // Prefer hits whose snippet mentions the city name
    const cityLower = city.toLowerCase();
    const best = hits.find((h) => (h.snippet || '').toLowerCase().includes(cityLower)) || hits[0];
    return best.title.replace(/ /g, '_');
  } catch {
    return null;
  }
}

// Resilient fetch: try the curated title, fall back to search.
async function fetchSummary(wikiTitle, n, city) {
  const first = await fetchSummaryByTitle(wikiTitle);
  if (first.ok) return first;
  const resolved = await searchResolve(n.name, city.name, city.country);
  if (resolved && resolved !== wikiTitle) {
    const second = await fetchSummaryByTitle(resolved);
    if (second.ok) return { ...second, resolvedTitle: resolved };
  }
  return first;
}

// When a summary has no image, try the Commons category "X (neighbourhood)" for one.
async function commonsImageFor(title) {
  const category = `Category:${title.replace(/_/g, ' ')}`;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=${encodeURIComponent(category)}&gcmtype=file&gcmlimit=5&prop=imageinfo&iiprop=url&format=json&origin=*`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const json = await res.json();
    const pages = json?.query?.pages;
    if (!pages) return null;
    for (const p of Object.values(pages)) {
      const info = p.imageinfo?.[0];
      if (info?.url && /\.(jpg|jpeg|png)$/i.test(info.url)) return info.url;
    }
    return null;
  } catch {
    return null;
  }
}

// Fetch up to 8 article images from a Wikipedia page via the REST media-list endpoint.
// Returns an array of image URLs (not just titles), which can be used directly in img tags.
async function fetchImageGallery(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(wikiTitle)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json?.items || [];
    const out = [];
    for (const item of items) {
      if (item.type !== 'image') continue;
      // Some entries have srcset (preferred), others have src
      const srcset = item.srcset && item.srcset[0] && item.srcset[0].src;
      const src = srcset || item.src;
      if (!src) continue;
      // Normalize protocol-relative URLs
      const url = src.startsWith('//') ? `https:${src}` : src;
      // Skip non-photo formats (svg, gif maps, etc.)
      if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url)) continue;
      out.push(url);
      if (out.length >= 8) break;
    }
    return out;
  } catch {
    return [];
  }
}

// Fetch ~30 nearby points of interest from OpenStreetMap via the Overpass API.
// Filters to amenity / shop / leisure / tourism nodes within ~1km of the coordinates.
// Returns categorized arrays so the UI can render them under section headings.
async function fetchOSMPOIs(coords) {
  if (!coords?.lat || !coords?.lon) return null;
  const radius = 800; // metres
  const lat = coords.lat;
  const lon = coords.lon;
  const query = `[out:json][timeout:25];
(
  node["amenity"~"^(restaurant|cafe|bar|pub|nightclub|biergarten|fast_food|food_court|ice_cream)$"](around:${radius},${lat},${lon});
  node["shop"~"^(books|gift|clothes|art|music|antiques|second_hand|boutique|bakery|deli|wine|cheese|chocolate)$"](around:${radius},${lat},${lon});
  node["tourism"~"^(museum|gallery|attraction|viewpoint|artwork)$"](around:${radius},${lat},${lon});
  node["leisure"~"^(park|garden)$"](around:${radius},${lat},${lon});
);
out body 100;`;
  const url = 'https://overpass-api.de/api/interpreter';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'text/plain' },
      body: query,
    });
    if (!res.ok) return null;
    const json = await res.json();
    const elements = json?.elements || [];
    const restaurants = [];
    const cafes = [];
    const bars = [];
    const shops = [];
    const culture = [];
    const parks = [];
    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name || tags['name:en'];
      if (!name) continue;
      const item = { name, lat: el.lat, lon: el.lon };
      if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food' || tags.amenity === 'food_court' || tags.amenity === 'ice_cream') {
        if (tags.cuisine) item.cuisine = tags.cuisine.replace(/[_;]/g, ', ');
        restaurants.push(item);
      } else if (tags.amenity === 'cafe') {
        cafes.push(item);
      } else if (tags.amenity === 'bar' || tags.amenity === 'pub' || tags.amenity === 'nightclub' || tags.amenity === 'biergarten') {
        bars.push(item);
      } else if (tags.shop) {
        item.shop = tags.shop.replace(/_/g, ' ');
        shops.push(item);
      } else if (tags.tourism === 'museum' || tags.tourism === 'gallery' || tags.tourism === 'artwork' || tags.tourism === 'viewpoint' || tags.tourism === 'attraction') {
        item.kind = tags.tourism;
        culture.push(item);
      } else if (tags.leisure === 'park' || tags.leisure === 'garden') {
        parks.push(item);
      }
    }
    // Trim each category to a maximum number of entries to keep file size reasonable
    return {
      restaurants: restaurants.slice(0, 12),
      cafes: cafes.slice(0, 8),
      bars: bars.slice(0, 8),
      shops: shops.slice(0, 8),
      culture: culture.slice(0, 8),
      parks: parks.slice(0, 5),
    };
  } catch {
    return null;
  }
}

// Clean up Wikipedia prose: drop parenthetical pronunciation and reference marks.
// Preserves paragraph breaks (double newlines) so the renderer can paragraph-split.
function cleanExtract(text) {
  if (!text) return '';
  let out = text;
  // Drop IPA/pronunciation parenthetical chunks that are hard to read.
  out = out.replace(/\s*\(pronounced[^)]*\)/gi, '');
  out = out.replace(/\s*\([^)]*i̯?ɐ̯?ʊ̯?ɑ̯?[^)]*\)/g, '');
  // Drop bracketed citation marks like [1], [12], [a]
  out = out.replace(/\[[a-zA-Z0-9]+\]/g, '');
  // Normalize line endings, collapse 3+ newlines to paragraph breaks
  out = out.replace(/\r\n?/g, '\n');
  out = out.replace(/\n{2,}/g, '\n\n');
  // Collapse runs of spaces (but keep \n)
  out = out.split('\n').map((line) => line.replace(/[ \t]+/g, ' ').trim()).join('\n');
  return out.trim();
}

// Build a long blurb — up to ~5000 chars across 4-8 paragraphs, preferring sentence
// boundaries. Wikipedia extracts come back as plain text with paragraph breaks
// represented as newlines; we preserve those so the page can render real paragraphs.
function buildBlurb(extract, fallback) {
  const cleaned = cleanExtract(extract);
  if (!cleaned) return fallback;
  if (cleaned.length <= 5000) return cleaned;
  const trimmed = cleaned.slice(0, 5000);
  // Prefer paragraph break, then sentence break
  const lastPara = trimmed.lastIndexOf('\n\n');
  if (lastPara > 2500) return trimmed.slice(0, lastPara);
  const lastDot = Math.max(trimmed.lastIndexOf('. '), trimmed.lastIndexOf('? '), trimmed.lastIndexOf('! '));
  return (lastDot > 2500 ? trimmed.slice(0, lastDot + 1) : trimmed + '…');
}

// Fetch the full plain-text article body via the MediaWiki "extracts" API.
// The exchars/exsentences parameters are silently capped server-side, so we
// instead omit them and request the entire extract (potentially tens of kB),
// then trim client-side in buildBlurb. exlimit=1 keeps it to a single page.
async function fetchLongExtract(wikiTitle) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=0&exlimit=1&redirects=1&format=json&origin=*&titles=${encodeURIComponent(wikiTitle)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const json = await res.json();
    const pages = json?.query?.pages;
    if (!pages) return null;
    for (const p of Object.values(pages)) {
      if (p.extract) return p.extract;
    }
    return null;
  } catch {
    return null;
  }
}

function jsEscape(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, '');
}

async function main() {
  const entries = [];
  const failures = [];
  let ok = 0;
  let total = 0;
  for (const city of CITIES) {
    console.log(`\n━━ ${city.name}, ${city.country} ━━`);
    // Fetch all 5 in parallel
    const results = await Promise.all(city.neighborhoods.map((n) => fetchSummary(n.wiki, n, city)));
    // For entries missing an image, try Wikimedia Commons in parallel
    const imageFills = await Promise.all(results.map(async (r, i) => {
      if (!r.ok) return null;
      if (r.originalImage || r.thumbnail) return null;
      const title = r.resolvedTitle || city.neighborhoods[i].wiki;
      return commonsImageFor(title);
    }));
    for (let i = 0; i < city.neighborhoods.length; i++) {
      total++;
      const n = city.neighborhoods[i];
      const r = results[i];
      if (!r.ok) {
        console.log(`  ${n.customBlurb ? '◐' : '✘'} ${n.name}  (${r.status || r.error || 'error'}${n.customBlurb ? ' — using custom blurb' : ''})`);
        if (!n.customBlurb) failures.push({ city: city.name, name: n.name, wiki: n.wiki });
        entries.push({
          name: n.name, city: city.name, country: city.country, cityRank: n.cityRank,
          tag: n.tag,
          blurb: n.customBlurb || `${n.name} is one of the most celebrated neighborhoods in ${city.name}, ${city.country}. ${n.tag}.`,
          highlights: n.customHighlights || [],
          wikiUrl: `https://en.wikipedia.org/wiki/${n.wiki}`,
          wikiImage: null,
          coords: null,
          gallery: [],
          pois: null,
        });
        continue;
      }
      ok++;
      const img = r.originalImage || r.thumbnail || imageFills[i] || null;
      const resolved = r.resolvedTitle ? ` [→ ${r.resolvedTitle}]` : '';
      // Fetch additional content in parallel
      const titleForExtras = r.resolvedTitle || n.wiki;
      const coords = r.coordinates ? { lat: r.coordinates.lat, lon: r.coordinates.lon } : null;
      // OSM Overpass is gated behind FETCH_POIS=1 because it's much slower than
      // the Wikipedia endpoints (5-15 sec/query). Run a separate POI-only pass
      // when you want to refresh venue data.
      const [longExtract, gallery, pois] = await Promise.all([
        fetchLongExtract(titleForExtras),
        fetchImageGallery(titleForExtras),
        process.env.FETCH_POIS === '1' ? fetchOSMPOIs(coords) : Promise.resolve(null),
      ]);
      const bodyText = longExtract && longExtract.length > r.extract.length ? longExtract : r.extract;
      // Filter the gallery to remove the hero image (already shown separately)
      const galleryFiltered = (gallery || []).filter((u) => u !== img).slice(0, 6);
      const poiCount = pois ? (pois.restaurants.length + pois.cafes.length + pois.bars.length + pois.shops.length + pois.culture.length + pois.parks.length) : 0;
      console.log(`  ✓ ${n.name}  (${bodyText.length}c, ${galleryFiltered.length}img, ${poiCount}poi${resolved})`);
      entries.push({
        name: n.name,
        city: city.name,
        country: city.country,
        cityRank: n.cityRank,
        tag: n.tag,
        blurb: buildBlurb(bodyText, `${n.name} — ${n.tag}`),
        highlights: r.description ? [r.description] : [],
        wikiUrl: r.pageUrl,
        wikiImage: img,
        coords,
        gallery: galleryFiltered,
        pois: pois || null,
      });
    }
  }

  // Build the file contents
  const countries = [];
  const seen = new Set();
  for (const city of CITIES) {
    if (seen.has(city.country)) continue;
    seen.add(city.country);
    countries.push({ name: city.country, flag: city.flag || '🌍' });
  }

  const fileContent = `// lib/neighborhood-data.js
// AUTO-GENERATED by scripts/fetch-neighborhoods.mjs on ${new Date().toISOString()}
// Wikipedia content is used under the CC BY-SA 4.0 licence — every neighborhood
// page displays attribution and a link back to the source article.
// To edit: update scripts/cities-seed.mjs and re-run the script.

export const NEIGHBORHOODS = ${stringify(entries)};

export const COUNTRIES = ${stringify(countries)};
`;

  writeFileSync(OUT, fileContent, 'utf8');

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Wrote ${entries.length} neighborhoods → ${OUT}`);
  console.log(`Success: ${ok}/${total}${failures.length ? `  (${failures.length} fallback stubs)` : ''}`);
  if (failures.length) {
    console.log(`Failures:`);
    for (const f of failures) console.log(`  - ${f.city} / ${f.name}  (wiki: ${f.wiki})`);
  }
}

// Pretty-print helper: compact objects but with newlines between entries
function stringify(arr) {
  if (Array.isArray(arr)) {
    const inner = arr.map((x) => '  ' + objOneLine(x)).join(',\n');
    return `[\n${inner}\n]`;
  }
  return JSON.stringify(arr, null, 2);
}

function objOneLine(obj) {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    parts.push(`${JSON.stringify(k)}: ${inlineVal(v)}`);
  }
  return '{ ' + parts.join(', ') + ' }';
}

function inlineVal(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return '[' + v.map(inlineVal).join(', ') + ']';
  if (typeof v === 'object') return '{ ' + Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inlineVal(x)}`).join(', ') + ' }';
  return JSON.stringify(v);
}

main().catch((e) => { console.error(e); process.exit(1); });
