// scripts/enrich-pois.mjs
// Incremental enrichment script: loads the existing neighborhood-data.js,
// fetches OSM POIs for any entry that has coordinates but no pois data,
// and writes back. Safe to interrupt and resume — it only updates entries
// it has not already processed.
//
// Run with:  node scripts/enrich-pois.mjs
// Resume:    just re-run; entries that already have pois are skipped.
// Limit:     LIMIT=50 node scripts/enrich-pois.mjs  (only enrich first 50)
// Force:     FORCE=1 node scripts/enrich-pois.mjs  (re-fetch everything)

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'lib', 'neighborhood-data.js');
const UA = '50bestneighborhoods/1.0 (https://50bestneighborhoods.com; contact@50bestneighborhoods.com)';
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '8', 10);
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;
const FORCE = process.env.FORCE === '1';
// MAX_RANK=1 enriches only the top-ranked neighborhood per city (the headline
// pages). MAX_RANK=5 means everything. Default is 1 to keep runs short.
const MAX_RANK = parseInt(process.env.MAX_RANK || '1', 10);

// Load the existing data file by importing it (it's a JS module).
async function loadData() {
  const mod = await import(DATA_FILE);
  return { neighborhoods: mod.NEIGHBORHOODS, countries: mod.COUNTRIES };
}

// List of Overpass mirrors to try in order. The main instance is overloaded
// during the day; the kumi systems mirror is often faster and more reliable.
const OVERPASS_URLS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
];

async function postWithTimeout(url, body, timeoutMs = 45000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
}

async function fetchOSMPOIs(coords) {
  if (!coords?.lat || !coords?.lon) return null;
  const radius = 800;
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
  const body = 'data=' + encodeURIComponent(query);
  // Try each mirror; on connection error or non-200, fall through
  let lastError = null;
  for (const url of OVERPASS_URLS) {
    try {
      const res = await postWithTimeout(url, body, 45000);
      if (!res.ok) { lastError = `HTTP ${res.status}`; continue; }
      var json = await res.json();
      lastError = null;
      break;
    } catch (e) {
      lastError = String(e?.message || e);
    }
  }
  if (lastError) return { error: lastError };
  try {
    const elements = json?.elements || [];
    const restaurants = [], cafes = [], bars = [], shops = [], culture = [], parks = [];
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
    return {
      restaurants: restaurants.slice(0, 12),
      cafes: cafes.slice(0, 8),
      bars: bars.slice(0, 8),
      shops: shops.slice(0, 8),
      culture: culture.slice(0, 8),
      parks: parks.slice(0, 5),
    };
  } catch (e) {
    return { error: 'parse: ' + String(e) };
  }
}

// Process N items at a time
async function processInBatches(items, batchSize, processItem) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(processItem));
  }
}

function inlineVal(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return '[' + v.map(inlineVal).join(', ') + ']';
  if (typeof v === 'object') return '{ ' + Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inlineVal(x)}`).join(', ') + ' }';
  return JSON.stringify(v);
}

function objOneLine(obj) {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    parts.push(`${JSON.stringify(k)}: ${inlineVal(v)}`);
  }
  return '{ ' + parts.join(', ') + ' }';
}

function stringifyArray(arr) {
  const inner = arr.map((x) => '  ' + objOneLine(x)).join(',\n');
  return `[\n${inner}\n]`;
}

function writeData(neighborhoods, countries) {
  const fileContent = `// lib/neighborhood-data.js
// AUTO-GENERATED — last enriched with OSM POIs on ${new Date().toISOString()}
// Wikipedia content used under CC BY-SA 4.0; OSM venue data under ODbL.
// To edit: update scripts/cities-seed.mjs and re-run scripts/fetch-neighborhoods.mjs.
// To refresh POIs only: run scripts/enrich-pois.mjs.

export const NEIGHBORHOODS = ${stringifyArray(neighborhoods)};

export const COUNTRIES = ${stringifyArray(countries)};
`;
  writeFileSync(DATA_FILE, fileContent, 'utf8');
}

async function main() {
  const { neighborhoods, countries } = await loadData();
  console.log(`Loaded ${neighborhoods.length} neighborhoods.`);

  const candidates = neighborhoods
    .filter((n) => n.coords && n.cityRank <= MAX_RANK && (FORCE || !n.pois))
    .slice(0, LIMIT);
  console.log(`Will enrich ${candidates.length} entries with POIs (CONCURRENCY=${CONCURRENCY}).`);

  let done = 0;
  let withPois = 0;
  let saveCounter = 0;
  const startedAt = Date.now();

  await processInBatches(candidates, CONCURRENCY, async (n) => {
    const pois = await fetchOSMPOIs(n.coords);
    done++;
    if (pois && !pois.error) {
      n.pois = pois;
      const total = pois.restaurants.length + pois.cafes.length + pois.bars.length + pois.shops.length + pois.culture.length + pois.parks.length;
      withPois++;
      console.log(`  [${done}/${candidates.length}] ✓ ${n.name}, ${n.city}  (${total} venues)`);
    } else {
      console.log(`  [${done}/${candidates.length}] ∅ ${n.name}, ${n.city}  (no venues${pois?.error ? ': ' + pois.error : ''})`);
      n.pois = null;
    }
    // Save every 25 entries so progress is preserved if interrupted
    if (++saveCounter >= 25) {
      writeData(neighborhoods, countries);
      saveCounter = 0;
    }
  });

  // Final save
  writeData(neighborhoods, countries);
  const elapsedSec = Math.round((Date.now() - startedAt) / 1000);
  console.log(`\nDone. ${withPois}/${candidates.length} enriched with POI data in ${elapsedSec}s.`);
  console.log(`Total entries with POIs: ${neighborhoods.filter((n) => n.pois).length}/${neighborhoods.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
