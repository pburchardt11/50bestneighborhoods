import { notFound } from 'next/navigation';
import { getCity, getAllCities, neighborhoodSlug, toSlug, cardImage } from '../../../lib/neighborhood-db';
import { CITY_INTROS } from '../../../lib/content';

export async function generateStaticParams() {
  return getAllCities().map((c) => ({ slug: toSlug(c.name) }));
}

export async function generateMetadata({ params }) {
  const c = getCity(params.slug);
  if (!c) return {};
  const title = `The ${c.count} Best Neighborhoods in ${c.name}`;
  return {
    title,
    description: `Editorial guide to the best neighborhoods in ${c.name}, ${c.country}. Rankings, local tips, and sources.`,
    alternates: { canonical: `https://www.50bestneighborhoods.com/city/${toSlug(c.name)}` },
  };
}

export default function CityPage({ params }) {
  const c = getCity(params.slug);
  if (!c) notFound();
  const intro = CITY_INTROS[c.name] || `An editorial guide to the best neighborhoods in ${c.name}, ${c.country}.`;

  return (
    <main>
      <section style={{ padding: '80px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 10, fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 18 }}>
            <a href="/">Home</a> <span>/</span>
            <a href={`/country/${toSlug(c.country)}`}>{c.country}</a>
          </div>
          <div className="eyebrow">City Guide</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px,8vw,104px)', fontWeight: 400, margin: '12px 0 6px', color: '#f5f0e8' }}>
            Best Neighborhoods in <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>{c.name}</em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--text-dim)', maxWidth: 820 }}>{intro}</p>
        </div>
      </section>

      <section className="container" style={{ marginTop: 48 }}>
        <div className="grid-auto">
          {c.neighborhoods.map((n) => (
            <a key={neighborhoodSlug(n)} href={`/neighborhood/${neighborhoodSlug(n)}`} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                height: 220,
                background: `linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.92) 100%), url('${cardImage(n)}') center/cover no-repeat, #1a1a1a`,
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(201,162,75,0.2)', color: '#c9a24b', border: '1px solid rgba(201,162,75,0.45)', padding: '5px 12px', fontSize: 11, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  #{n.cityRank}
                </div>
                <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                  <div className="serif-display" style={{ fontSize: 28, color: '#f5f0e8' }}>{n.name}</div>
                  <div style={{ color: '#c9a24b', fontStyle: 'italic', fontSize: 14, marginTop: 2 }}>{n.tag}</div>
                </div>
              </div>
              <div style={{ padding: '16px 18px', color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>
                {n.blurb.slice(0, 140)}…
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
