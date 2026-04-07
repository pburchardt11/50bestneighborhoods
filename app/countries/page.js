import { getAllCountries, toSlug } from '../../lib/neighborhood-db';

export const metadata = {
  title: 'All Countries',
  description: 'Every country covered by 50 Best Neighborhoods.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/countries' },
};

export default function CountriesPage() {
  const countries = getAllCountries();
  return (
    <main className="container" style={{ padding: '60px 0 80px' }}>
      <div className="eyebrow">Index</div>
      <h1 className="serif-display" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, margin: '10px 0 4px', color: '#f5f0e8' }}>
        All <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>countries</em>
      </h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 36 }}>
        {countries.length} countries · {countries.reduce((a, c) => a + c.count, 0)} neighborhoods
      </p>
      <ul style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 8,
      }}>
        {countries.map((c) => (
          <li key={c.name}>
            <a
              href={`/country/${toSlug(c.name)}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.012)',
                borderRadius: 2,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{c.flag}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <div className="serif-display" style={{ fontSize: 17, color: '#f5f0e8', lineHeight: 1.15 }}>{c.name}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 10, fontFamily: "'Outfit', sans-serif", letterSpacing: 0.5, marginTop: 1 }}>
                  {c.cities} {c.cities === 1 ? 'city' : 'cities'} · {c.count} neighborhoods
                </div>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
