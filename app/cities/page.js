import { getAllCities, getAllCountries, toSlug } from '../../lib/neighborhood-db';

export const metadata = {
  title: 'All Cities',
  description: 'Every city covered by 50 Best Neighborhoods.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/cities' },
};

export default function CitiesPage() {
  const cities = getAllCities();
  const countries = getAllCountries();

  // Group cities by country, then sort countries alphabetically
  const byCountry = new Map();
  for (const c of cities) {
    if (!byCountry.has(c.country)) byCountry.set(c.country, []);
    byCountry.get(c.country).push(c);
  }
  const flagFor = (name) => countries.find((c) => c.name === name)?.flag || '🌍';
  const grouped = Array.from(byCountry.entries())
    .map(([country, list]) => ({ country, list: list.sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => a.country.localeCompare(b.country));

  return (
    <main className="container" style={{ padding: '60px 0 80px' }}>
      <div className="eyebrow">Index</div>
      <h1 className="serif-display" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, margin: '10px 0 4px', color: '#f5f0e8' }}>
        All <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>cities</em>
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 36 }}>
        {cities.length} cities · {grouped.length} countries
      </p>

      {grouped.map(({ country, list }) => (
        <section key={country} style={{ marginBottom: 36 }}>
          <h2 style={{
            display: 'flex', alignItems: 'baseline', gap: 12,
            fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2.5,
            textTransform: 'uppercase', color: 'var(--accent)',
            margin: '0 0 12px', paddingBottom: 8,
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 16 }}>{flagFor(country)}</span>
            <a href={`/country/${toSlug(country)}`} style={{ color: 'inherit' }}>{country}</a>
            <span style={{ color: 'var(--text-dim)', fontSize: 10, letterSpacing: 1.2 }}>· {list.length}</span>
          </h2>
          <ul style={{
            listStyle: 'none', padding: 0, margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 6,
          }}>
            {list.map((c) => (
              <li key={c.name}>
                <a
                  href={`/city/${toSlug(c.name)}`}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    gap: 8,
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.012)',
                    borderRadius: 2,
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <span className="serif-display" style={{ fontSize: 17, color: '#f5f0e8', lineHeight: 1.2 }}>{c.name}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: 'var(--text-dim)', letterSpacing: 0.5 }}>{c.count}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
