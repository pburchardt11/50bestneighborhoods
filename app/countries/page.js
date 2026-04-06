import { getAllCountries, toSlug } from '../../lib/neighborhood-db';

export const metadata = { title: 'All Countries' };

export default function CountriesPage() {
  const countries = getAllCountries();
  return (
    <main className="container" style={{ padding: '80px 0' }}>
      <div className="eyebrow">Index</div>
      <h1 className="serif-display" style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 400, margin: '12px 0 30px', color: '#f5f0e8' }}>All countries</h1>
      <div className="grid-auto">
        {countries.map((c) => (
          <a key={c.name} href={`/country/${toSlug(c.name)}`} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 36 }}>{c.flag}</span>
            <div>
              <div className="serif-display" style={{ fontSize: 24, color: '#f5f0e8' }}>{c.name}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>{c.cities} {c.cities === 1 ? 'city' : 'cities'} · {c.count} neighborhoods</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
