// scripts/rewrite-blurbs.mjs
// LLM editorial rewrite pass: takes the existing Wikipedia-derived blurbs in
// lib/neighborhood-data.js and rewrites each one in the 50 Best editorial voice
// using Vercel AI Gateway. Saves the rewritten prose into a new field
// `editorialBlurb`, leaving the original `blurb` (and Wikipedia attribution)
// untouched as a fallback.
//
// Setup (one-time):
//   1. Make sure the project is linked:    vercel link
//   2. Pull OIDC credentials:              vercel env pull .env.local
//      (this provisions VERCEL_OIDC_TOKEN which @ai-sdk/gateway reads automatically)
//   3. Install AI SDK dependencies:        npm install ai @ai-sdk/gateway
//
// Run (full):     node scripts/rewrite-blurbs.mjs
// Run (sample):   LIMIT=20 node scripts/rewrite-blurbs.mjs
// Resume:         re-run; entries that already have editorialBlurb are skipped.
// Force:          FORCE=1 node scripts/rewrite-blurbs.mjs
//
// Cost: ~$0.005 per entry × ~990 entries = ~$5 total at Sonnet-4.6 prices.
// Runtime: ~30-45 minutes with CONCURRENCY=4.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'lib', 'neighborhood-data.js');
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '4', 10);
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;
const FORCE = process.env.FORCE === '1';
const MODEL = process.env.MODEL || 'anthropic/claude-sonnet-4.6';

const SYSTEM_PROMPT = `You are an editorial writer for 50 Best Neighborhoods, a sophisticated travel reference guide in the style of Time Out, Condé Nast Traveler and Monocle. Your job is to rewrite encyclopedic Wikipedia content into original editorial prose with a distinctive voice.

VOICE:
- Confident, opinionated, well-travelled
- Slightly dry, occasionally witty, never cute
- Specific over general — name streets, venues, time periods
- Reads like a knowledgeable friend, not a press release
- British/international English, not American

STRUCTURE:
- 3-4 paragraphs, ~250-400 words total
- Open with a sharp observation about what makes the neighborhood distinctive
- Middle paragraphs: layered detail (history, character, food/drink/shopping/culture)
- Close with a sentence that gives the reader a reason to go

RULES:
- NEVER repeat the neighborhood name more than 3 times
- NEVER start with "Located in..." or "Known as..."
- NO travel-brochure clichés (hidden gem, must-visit, off-the-beaten-path, vibrant, charming)
- NO bullet points, no headings, no markdown
- Write in flowing prose
- Preserve specific facts from the source — dates, names, distances, populations
- If the source is thin, write what you can confidently say without inventing facts`;

async function loadData() {
  const mod = await import(DATA_FILE);
  return { neighborhoods: mod.NEIGHBORHOODS, countries: mod.COUNTRIES };
}

async function rewriteOne(entry, generateText) {
  const userPrompt = `Rewrite the following Wikipedia content as original editorial prose for 50 Best Neighborhoods.

Neighborhood: ${entry.name}
City: ${entry.city}, ${entry.country}
Editorial tag: ${entry.tag}
Rank in city: #${entry.cityRank}

Source content (Wikipedia):
${entry.blurb}

Write the editorial blurb now. 3-4 paragraphs, ~300 words. No preamble — start with the prose.`;

  try {
    const result = await generateText({
      model: MODEL,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 800,
    });
    return result.text.trim();
  } catch (e) {
    console.error('  ERROR:', e?.message || e);
    return null;
  }
}

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
  for (const [k, v] of Object.entries(obj)) parts.push(`${JSON.stringify(k)}: ${inlineVal(v)}`);
  return '{ ' + parts.join(', ') + ' }';
}

function stringifyArray(arr) {
  const inner = arr.map((x) => '  ' + objOneLine(x)).join(',\n');
  return `[\n${inner}\n]`;
}

function writeData(neighborhoods, countries) {
  const fileContent = `// lib/neighborhood-data.js
// AUTO-GENERATED — last edited at ${new Date().toISOString()}
// Wikipedia content used under CC BY-SA 4.0; OSM venue data under ODbL.

export const NEIGHBORHOODS = ${stringifyArray(neighborhoods)};

export const COUNTRIES = ${stringifyArray(countries)};
`;
  writeFileSync(DATA_FILE, fileContent, 'utf8');
}

async function main() {
  // Lazy-import the AI SDK so the script can be inspected without it installed
  let generateText;
  try {
    const ai = await import('ai');
    generateText = ai.generateText;
  } catch (e) {
    console.error('Missing dependency: install with  npm install ai @ai-sdk/gateway');
    console.error('Then make sure VERCEL_OIDC_TOKEN is set:  vercel env pull .env.local');
    process.exit(1);
  }

  const { neighborhoods, countries } = await loadData();
  console.log(`Loaded ${neighborhoods.length} neighborhoods.`);

  const candidates = neighborhoods
    .filter((n) => n.blurb && n.blurb.length > 200 && (FORCE || !n.editorialBlurb))
    .slice(0, LIMIT);
  console.log(`Will rewrite ${candidates.length} blurbs (model: ${MODEL}, concurrency: ${CONCURRENCY}).`);
  console.log(`Estimated cost: ~$${(candidates.length * 0.005).toFixed(2)}`);
  console.log(`Estimated runtime: ~${Math.round((candidates.length / CONCURRENCY) * 8 / 60)} minutes`);
  console.log('');

  let done = 0;
  let succeeded = 0;
  let saveCounter = 0;
  const startedAt = Date.now();

  await processInBatches(candidates, CONCURRENCY, async (n) => {
    const rewritten = await rewriteOne(n, generateText);
    done++;
    if (rewritten && rewritten.length > 200) {
      n.editorialBlurb = rewritten;
      succeeded++;
      console.log(`  [${done}/${candidates.length}] ✓ ${n.name}, ${n.city}  (${rewritten.length} chars)`);
    } else {
      console.log(`  [${done}/${candidates.length}] ✘ ${n.name}, ${n.city}  (rewrite failed)`);
    }
    if (++saveCounter >= 20) {
      writeData(neighborhoods, countries);
      saveCounter = 0;
    }
  });

  writeData(neighborhoods, countries);
  const elapsedMin = Math.round((Date.now() - startedAt) / 60000);
  console.log(`\nDone. ${succeeded}/${candidates.length} blurbs rewritten in ${elapsedMin}m.`);
  console.log(`Total entries with editorial blurbs: ${neighborhoods.filter((n) => n.editorialBlurb).length}/${neighborhoods.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
