import { getTop50, neighborhoodSlug, cardImage } from '../../lib/neighborhood-db';

export const metadata = {
  title: 'The 50 Best Neighborhoods in the World',
  description: 'Our flagship global ranking — one neighborhood per city, editorially ranked.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/top-50' },
};

export default function Top50Page() {
  const top = getTop50();
  return (
    <main>
      <section style={{ padding: '80px 0 30px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="eyebrow">The Global Ranking</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px,8vw,112px)', fontWeight: 400, margin: '14px 0 8px', color: '#f5f0e8' }}>
            The <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>50 Best</em> Neighborhoods
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-dim)', maxWidth: 720, margin: '0 auto' }}>
            One flagship district per city, synthesizing rankings from Time Out, Condé Nast Traveler, The New York Times and more.
          </p>
        </div>
      </section>

      <section className="container" style={{ marginTop: 48 }}>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 20 }}>
          {top.map((n, i) => (
            <li key={neighborhoodSlug(n)}>
              <a href={`/neighborhood/${neighborhoodSlug(n)}`} className="card" style={{ display: 'grid', gridTemplateColumns: '100px 1fr 220px', alignItems: 'stretch', overflow: 'hidden' }}>
                <div style={{ background: 'rgba(201,162,75,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="serif-display" style={{ fontSize: 56, color: '#c9a24b' }}>{i + 1}</span>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{n.city}, {n.country}</div>
                  <div className="serif-display" style={{ fontSize: 30, color: '#f5f0e8', margin: '4px 0 6px' }}>{n.name}</div>
                  <div style={{ color: '#c9a24b', fontStyle: 'italic', fontSize: 15, marginBottom: 10 }}>{n.tag}</div>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{n.blurb.slice(0, 200)}…</p>
                </div>
                <div style={{
                  background: `url('${cardImage(n, 500, 400)}') center/cover no-repeat, #1a1a1a`,
                  minHeight: 160,
                }} />
              </a>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
