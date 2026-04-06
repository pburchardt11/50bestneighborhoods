// Static JSON search index — prebuilt at build time from the data file.
import { NextResponse } from 'next/server';
import { getAllNeighborhoods, getAllCities, getAllCountries, neighborhoodSlug, toSlug } from '../../../lib/neighborhood-db';

export const dynamic = 'force-static';

export function GET() {
  const items = [];
  for (const n of getAllNeighborhoods()) {
    items.push({
      type: 'neighborhood',
      name: n.name,
      city: n.city,
      country: n.country,
      tag: n.tag,
      url: `/neighborhood/${neighborhoodSlug(n)}`,
    });
  }
  for (const c of getAllCities()) {
    items.push({
      type: 'city',
      name: c.name,
      country: c.country,
      url: `/city/${toSlug(c.name)}`,
    });
  }
  for (const c of getAllCountries()) {
    items.push({
      type: 'country',
      name: c.name,
      url: `/country/${toSlug(c.name)}`,
    });
  }
  return NextResponse.json(items);
}
