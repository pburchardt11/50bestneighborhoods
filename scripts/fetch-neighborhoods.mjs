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

async function fetchSummary(wikiTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (!res.ok) return { ok: false, status: res.status };
    const json = await res.json();
    return {
      ok: true,
      description: json.description || '',
      extract: json.extract || '',
      pageUrl: json.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${wikiTitle}`,
      thumbnail: json.thumbnail?.source || null,
      originalImage: json.originalimage?.source || null,
      coordinates: json.coordinates || null,
    };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

// Clean up Wikipedia prose: drop parenthetical pronunciation, reference marks, and trim.
function cleanExtract(text) {
  if (!text) return '';
  let out = text;
  // Drop IPA/pronunciation parenthetical chunks that are hard to read in a card.
  out = out.replace(/\s*\(pronounced[^)]*\)/gi, '');
  out = out.replace(/\s*\([^)]*i̯?ɐ̯?ʊ̯?ɑ̯?[^)]*\)/g, '');
  // Collapse whitespace
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

// Build a blurb of up to ~600 chars, preferring whole sentences.
function buildBlurb(extract, fallback) {
  const cleaned = cleanExtract(extract);
  if (!cleaned) return fallback;
  if (cleaned.length <= 600) return cleaned;
  // Trim at the last sentence boundary before char 600
  const trimmed = cleaned.slice(0, 600);
  const lastDot = Math.max(trimmed.lastIndexOf('. '), trimmed.lastIndexOf('? '), trimmed.lastIndexOf('! '));
  return (lastDot > 300 ? trimmed.slice(0, lastDot + 1) : trimmed + '…');
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
    const results = await Promise.all(city.neighborhoods.map((n) => fetchSummary(n.wiki)));
    for (let i = 0; i < city.neighborhoods.length; i++) {
      total++;
      const n = city.neighborhoods[i];
      const r = results[i];
      if (!r.ok) {
        console.log(`  ✘ ${n.name}  (${r.status || r.error || 'error'})`);
        failures.push({ city: city.name, name: n.name, wiki: n.wiki });
        // Fallback stub entry so the page still builds
        entries.push({
          name: n.name, city: city.name, country: city.country, cityRank: n.cityRank,
          tag: n.tag,
          blurb: `${n.name} is one of the most celebrated neighborhoods in ${city.name}, ${city.country}. ${n.tag}.`,
          highlights: [],
          wikiUrl: `https://en.wikipedia.org/wiki/${n.wiki}`,
          wikiImage: null,
          sources: [
            { pub: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${n.wiki}` },
            ...sources(city.country),
          ],
        });
        continue;
      }
      ok++;
      console.log(`  ✓ ${n.name}  (${r.extract.length} chars)`);
      entries.push({
        name: n.name,
        city: city.name,
        country: city.country,
        cityRank: n.cityRank,
        tag: n.tag,
        blurb: buildBlurb(r.extract, `${n.name} — ${n.tag}`),
        highlights: r.description ? [r.description] : [],
        wikiUrl: r.pageUrl,
        wikiImage: r.originalImage || r.thumbnail,
        sources: [
          { pub: 'Wikipedia', url: r.pageUrl },
          ...sources(city.country),
        ],
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
