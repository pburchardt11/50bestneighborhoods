import { notFound } from 'next/navigation';
import { getCountry, getAllCountries, toSlug, neighborhoodSlug, cardImage } from '../../../lib/neighborhood-db';
import { COUNTRY_INTROS } from '../../../lib/content';

export async function generateStaticParams() {
  return getAllCountries().map((c) => ({ slug: toSlug(c.name) }));
}

export async function generateMetadata({ params }) {
  const c = getCountry(params.slug);
  if (!c) return {};
  return {
    title: `Best Neighborhoods in ${c.name}`,
    description: `Editorial guide to the best neighborhoods across cities in ${c.name}.`,
    alternates: { canonical: `https://www.50bestneighborhoods.com/country/${toSlug(c.name)}` },
  };
}

export default function CountryPage({ params }) {
  const c = getCountry(params.slug);
  if (!c) notFound();
  const intro = COUNTRY_INTROS[c.name] || `An editorial guide to the best neighborhoods across cities in ${c.name}.`;
  const total = c.cities.reduce((a, x) => a + x.count, 0);

  return (
    <main>
      <section style={{ padding: '80px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 10, fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 16 }}>
            <a href="/">Home</a> <span>/</span> <span>Countries</span>
          </div>
          <div className="eyebrow">Country Guide</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px,8vw,104px)', fontWeight: 400, margin: '12px 0 6px', color: '#f5f0e8' }}>
            <span style={{ fontSize: '0.7em', marginRight: 12 }}>{c.flag}</span>
            <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>{c.name}</em>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {c.cities.length} {c.cities.length === 1 ? 'city' : 'cities'} · {total} neighborhoods
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--text-dim)', maxWidth: 820, marginTop: 20 }}>{intro}</p>
        </div>
      </section>

      {c.cities.map((city) => (
        <section key={city.name} className="container" style={{ marginTop: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <h2 className="serif-display" style={{ fontSize: 40, fontWeight: 400, color: '#f5f0e8', margin: 0 }}>{city.name}</h2>
            <a href={`/city/${toSlug(city.name)}`} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase' }}>
              City guide →
            </a>
          </div>
          <div className="grid-auto">
            {city.neighborhoods.map((n) => (
              <a key={neighborhoodSlug(n)} href={`/neighborhood/${neighborhoodSlug(n)}`} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  height: 180,
                  background: `linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.92) 100%), url('${cardImage(n)}') center/cover no-repeat, #1a1a1a`,
                  position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(201,162,75,0.18)', color: '#c9a24b', border: '1px solid rgba(201,162,75,0.4)', padding: '4px 10px', fontSize: 10, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase' }}>#{n.cityRank}</div>
                  <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                    <div className="serif-display" style={{ fontSize: 22, color: '#f5f0e8' }}>{n.name}</div>
                    <div style={{ color: '#c9a24b', fontStyle: 'italic', fontSize: 13 }}>{n.tag}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
