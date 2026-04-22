// scripts/upload-images-to-blob.mjs
// Downloads each neighborhood's hero image and gallery from Wikimedia, resizes
// + converts to WebP with sharp, uploads to Vercel Blob, and rewrites the URLs
// in lib/neighborhood-data.js. Idempotent: skips entries already on Blob.
//
// Setup:
//   1. Create Blob store in Vercel dashboard (Public access)
//   2. vercel env pull .env.local
//   3. npm install @vercel/blob sharp
//
// Run:
//   node scripts/upload-images-to-blob.mjs
//
// Environment knobs:
//   LIMIT=20    only process first 20 entries (validation)
//   FORCE=1     re-upload entries that already have blob URLs
//   START=200   skip first N entries (resume from a specific index)

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';
import sharp from 'sharp';

// Load .env.local manually since this script runs outside Next.js
function loadEnv() {
  try {
    const env = readFileSync('.env.local', 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}
loadEnv();

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('ERROR: BLOB_READ_WRITE_TOKEN not set. Run: vercel env pull .env.local');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'lib', 'neighborhood-data.js');

const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;
const FORCE = process.env.FORCE === '1';
const START = process.env.START ? parseInt(process.env.START, 10) : 0;
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '2', 10);
const RETRY_ATTEMPTS = 4;

const HERO_WIDTH = 1200;
const HERO_HEIGHT = 800;
const THUMB_WIDTH = 600;
const THUMB_HEIGHT = 400;
const WEBP_QUALITY = 78;

const UA = '50bestneighborhoods/1.0 (https://50bestneighborhoods.com)';

async function loadData() {
  const mod = await import(DATA_FILE);
  return { neighborhoods: mod.NEIGHBORHOODS, countries: mod.COUNTRIES };
}

function isBlobUrl(url) {
  return typeof url === 'string' && url.includes('.blob.vercel-storage.com');
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// Polite fetch with exponential backoff on rate-limit / transient errors.
async function fetchImage(url) {
  let lastError = null;
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      // 429 = rate limit, 503 = service unavailable — both worth retrying
      if (res.status === 429 || res.status === 503 || res.status >= 500) {
        const wait = Math.min(2000 * Math.pow(2, attempt), 30000);
        await sleep(wait);
        lastError = `HTTP ${res.status}`;
        continue;
      }
      throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastError = String(e?.message || e);
      if (attempt < RETRY_ATTEMPTS - 1) await sleep(2000 * (attempt + 1));
    }
  }
  throw new Error(lastError || 'fetch failed');
}

async function processAndUpload(buffer, blobPath, w, h) {
  const webp = await sharp(buffer)
    .rotate() // honor EXIF orientation
    .resize(w, h, { fit: 'cover', position: 'centre' })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const result = await put(blobPath, webp, {
    access: 'public',
    contentType: 'image/webp',
    cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return result.url;
}

async function migrateOne(n, idx, total) {
  const slug = slugify(`${n.name}-${n.city}`);
  const updates = {};
  let processed = 0;
  let skipped = 0;
  const errors = [];

  // 1. Hero image
  if (n.wikiImage && (FORCE || !isBlobUrl(n.wikiImage))) {
    try {
      const buf = await fetchImage(n.wikiImage);
      const url = await processAndUpload(buf, `neighborhoods/${slug}/hero.webp`, HERO_WIDTH, HERO_HEIGHT);
      updates.wikiImage = url;
      processed++;
    } catch (e) {
      errors.push(`hero: ${e.message}`);
    }
  } else if (isBlobUrl(n.wikiImage)) {
    skipped++;
  }

  // 2. Gallery images
  if (Array.isArray(n.gallery) && n.gallery.length > 0) {
    const newGallery = [];
    for (let i = 0; i < n.gallery.length; i++) {
      const orig = n.gallery[i];
      if (isBlobUrl(orig) && !FORCE) {
        newGallery.push(orig);
        skipped++;
        continue;
      }
      try {
        const buf = await fetchImage(orig);
        const url = await processAndUpload(buf, `neighborhoods/${slug}/g${i}.webp`, THUMB_WIDTH, THUMB_HEIGHT);
        newGallery.push(url);
        processed++;
      } catch (e) {
        errors.push(`gallery[${i}]: ${e.message}`);
      }
    }
    if (newGallery.length > 0) updates.gallery = newGallery;
  }

  const status = processed > 0 ? '✓' : (skipped > 0 ? '◐' : '✘');
  console.log(`  [${idx + 1}/${total}] ${status} ${n.name}, ${n.city}  (uploaded ${processed}, skipped ${skipped}${errors.length ? ', errors: ' + errors.join('; ') : ''})`);
  return updates;
}

// JS file serializer (matches the format of fetch-neighborhoods.mjs output)
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
  for (const [k, v] of Object.entries(obj)) parts.push(`${JSON.stringify(k)}: ${inlineVal(v)}`);
  return '{ ' + parts.join(', ') + ' }';
}
function stringifyArray(arr) {
  const inner = arr.map((x) => '  ' + objOneLine(x)).join(',\n');
  return `[\n${inner}\n]`;
}

function writeData(neighborhoods, countries) {
  const fileContent = `// lib/neighborhood-data.js
// AUTO-GENERATED — last image migration ${new Date().toISOString()}
// Wikipedia content used under CC BY-SA 4.0; OSM venue data under ODbL.
// Images mirrored to Vercel Blob from Wikimedia Commons (CC-licensed).

export const NEIGHBORHOODS = ${stringifyArray(neighborhoods)};

export const COUNTRIES = ${stringifyArray(countries)};
`;
  writeFileSync(DATA_FILE, fileContent, 'utf8');
}

async function processInBatches(items, batchSize, processItem) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map((item, j) => processItem(item, i + j)));
  }
}

async function main() {
  const { neighborhoods, countries } = await loadData();
  console.log(`Loaded ${neighborhoods.length} neighborhoods.`);

  const candidates = neighborhoods
    .map((n, originalIdx) => ({ n, originalIdx }))
    .filter(({ n }) => n.wikiImage || (Array.isArray(n.gallery) && n.gallery.length > 0))
    .filter(({ n }) => FORCE || !isBlobUrl(n.wikiImage) || (n.gallery || []).some((u) => !isBlobUrl(u)))
    .slice(START, START + (LIMIT === Infinity ? Infinity : LIMIT));

  console.log(`Will migrate ${candidates.length} entries (concurrency ${CONCURRENCY}).`);
  console.log('');

  const startedAt = Date.now();
  let saveCounter = 0;

  await processInBatches(candidates, CONCURRENCY, async ({ n, originalIdx }, idx) => {
    const updates = await migrateOne(n, idx, candidates.length);
    Object.assign(neighborhoods[originalIdx], updates);
    if (++saveCounter >= 20) {
      writeData(neighborhoods, countries);
      saveCounter = 0;
    }
  });

  writeData(neighborhoods, countries);
  const elapsedMin = Math.round((Date.now() - startedAt) / 60000);
  console.log(`\nDone in ${elapsedMin}m.`);
  const blobified = neighborhoods.filter((n) => isBlobUrl(n.wikiImage)).length;
  console.log(`Heroes on Blob: ${blobified}/${neighborhoods.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
