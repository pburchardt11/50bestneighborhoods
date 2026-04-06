// lib/neighborhood-db.js
// Query helpers on top of the flagship dataset.
import { NEIGHBORHOODS, COUNTRIES } from './neighborhood-data';

export function toSlug(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function neighborhoodSlug(n) {
  return toSlug(`${n.name}-${n.city}`);
}

export function getAllNeighborhoods() {
  return NEIGHBORHOODS;
}

export function getAllCities() {
  const byCity = new Map();
  for (const n of NEIGHBORHOODS) {
    if (!byCity.has(n.city)) {
      byCity.set(n.city, { name: n.city, country: n.country, count: 0, neighborhoods: [] });
    }
    const entry = byCity.get(n.city);
    entry.count += 1;
    entry.neighborhoods.push(n);
  }
  for (const entry of byCity.values()) {
    entry.neighborhoods.sort((a, b) => a.cityRank - b.cityRank);
  }
  return Array.from(byCity.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllCountries() {
  const byCountry = new Map();
  for (const n of NEIGHBORHOODS) {
    if (!byCountry.has(n.country)) {
      const meta = COUNTRIES.find((c) => c.name === n.country) || {};
      byCountry.set(n.country, { name: n.country, flag: meta.flag || '🌍', cities: new Set(), count: 0 });
    }
    const entry = byCountry.get(n.country);
    entry.cities.add(n.city);
    entry.count += 1;
  }
  return Array.from(byCountry.values())
    .map((c) => ({ ...c, cities: c.cities.size }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCity(slug) {
  return getAllCities().find((c) => toSlug(c.name) === slug);
}

export function getCountry(slug) {
  const name = getAllCountries().find((c) => toSlug(c.name) === slug)?.name;
  if (!name) return null;
  const cities = getAllCities().filter((c) => c.country === name);
  const meta = COUNTRIES.find((c) => c.name === name) || {};
  return { name, flag: meta.flag || '🌍', cities };
}

export function getNeighborhood(slug) {
  return NEIGHBORHOODS.find((n) => neighborhoodSlug(n) === slug);
}

export function getTop50() {
  // Top-ranked (cityRank === 1) neighborhoods across all cities, then fill with cityRank 2, etc.
  const sorted = [...NEIGHBORHOODS].sort((a, b) => a.cityRank - b.cityRank);
  return sorted.slice(0, 50);
}

export function getStats() {
  return {
    neighborhoods: NEIGHBORHOODS.length,
    cities: new Set(NEIGHBORHOODS.map((n) => n.city)).size,
    countries: new Set(NEIGHBORHOODS.map((n) => n.country)).size,
  };
}

// Prefer the Wikipedia image (real, attributed) when we have one; fall back to
// a deterministic Unsplash Source URL keyed by the neighborhood slug.
export function heroImage(n, w = 1200, h = 800) {
  if (n && n.wikiImage) return n.wikiImage;
  const seed = toSlug(`${n.name}-${n.city}`);
  const query = encodeURIComponent(`${n.name} ${n.city} street`);
  return `https://source.unsplash.com/${w}x${h}/?${query},neighborhood&sig=${seed}`;
}

export function cardImage(n, w = 600, h = 400) {
  return heroImage(n, w, h);
}
