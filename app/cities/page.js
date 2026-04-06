import { getAllCities, toSlug } from '../../lib/neighborhood-db';

export const metadata = {
  title: 'All Cities',
  description: 'Every city covered by 50 Best Neighborhoods.',
};

export default function CitiesPage() {
  const cities = getAllCities();
  return (
    <main className="container" style={{ padding: '80px 0' }}>
      <div className="eyebrow">Index</div>
      <h1 className="serif-display" style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 400, margin: '12px 0 30px', color: '#f5f0e8' }}>All cities</h1>
      <div className="grid-auto">
        {cities.map((c) => (
          <a key={c.name} href={`/city/${toSlug(c.name)}`} className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{c.country}</div>
            <div className="serif-display" style={{ fontSize: 30, marginTop: 6, color: '#f5f0e8' }}>{c.name}</div>
            <div style={{ marginTop: 12, color: 'var(--accent)', fontFamily: "'Outfit', sans-serif", fontSize: 12 }}>{c.count} neighborhoods →</div>
          </a>
        ))}
      </div>
    </main>
  );
}
