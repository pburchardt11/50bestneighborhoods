import { notFound } from 'next/navigation';
import { getNeighborhood, getAllNeighborhoods, neighborhoodSlug, toSlug, heroImage } from '../../../lib/neighborhood-db';

export async function generateStaticParams() {
  return getAllNeighborhoods().map((n) => ({ slug: neighborhoodSlug(n) }));
}

export async function generateMetadata({ params }) {
  const n = getNeighborhood(params.slug);
  if (!n) return {};
  const title = `${n.name}, ${n.city} — #${n.cityRank} Best Neighborhood in ${n.city}`;
  return {
    title,
    description: `${n.tag}. ${n.blurb.slice(0, 140)}`,
    alternates: { canonical: `https://www.50bestneighborhoods.com/neighborhood/${neighborhoodSlug(n)}` },
    openGraph: { title, description: n.tag, images: [heroImage(n, 1200, 630)] },
  };
}

export default function NeighborhoodPage({ params }) {
  const n = getNeighborhood(params.slug);
  if (!n) notFound();

  // Related: other neighborhoods in same city
  const related = getAllNeighborhoods()
    .filter((x) => x.city === n.city && x.name !== n.name)
    .sort((a, b) => a.cityRank - b.cityRank);

  return (
    <main>
      {/* HERO */}
      <section style={{
        position: 'relative', minHeight: 460, padding: '80px 0 60px',
        backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.95) 95%), url('${heroImage(n)}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: 10, fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 16 }}>
            <a href="/">Home</a> <span>/</span>
            <a href={`/country/${toSlug(n.country)}`}>{n.country}</a> <span>/</span>
            <a href={`/city/${toSlug(n.city)}`}>{n.city}</a>
          </div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            #{n.cityRank} Best Neighborhood in {n.city}
          </div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px, 9vw, 112px)', fontWeight: 400, margin: 0, color: '#f5f0e8', lineHeight: 0.95 }}>
            {n.name}
          </h1>
          <p style={{ fontSize: 'clamp(18px,2.2vw,24px)', color: '#c9a24b', fontStyle: 'italic', marginTop: 14, maxWidth: 760 }}>
            {n.tag}
          </p>
        </div>
      </section>

      {/* BODY */}
      <section className="container" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', gap: 56 }}>
        <article>
          <h2 className="serif-display" style={{ fontSize: 32, fontWeight: 400, color: '#f5f0e8', margin: '0 0 16px' }}>About the neighborhood</h2>
          {n.highlights && n.highlights.length > 0 && (
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
              {n.highlights[0]}
            </p>
          )}
          <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--text)' }}>{n.blurb}</p>
          {n.wikiUrl && (
            <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>
              Encyclopedic content adapted from{' '}
              <a href={n.wikiUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                the Wikipedia article on {n.name}
              </a>
              , used under{' '}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>CC BY-SA 4.0</a>.
            </p>
          )}

          <h2 className="serif-display" style={{ fontSize: 28, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>Editorial sources</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 20 }}>
            Our rankings are synthesized from trusted travel and local press. Explore the original coverage:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {n.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                  <span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-dim)' }}>Source</span>
                    <br />
                    <span className="serif-display" style={{ fontSize: 18 }}>{s.pub}</span>
                  </span>
                  <span style={{ color: 'var(--accent)', fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase' }}>Read →</span>
                </a>
              </li>
            ))}
          </ul>
        </article>

        <aside>
          <div className="card" style={{ padding: 22 }}>
            <div className="eyebrow">Quick Facts</div>
            <dl style={{ marginTop: 14, fontSize: 14 }}>
              <Fact label="City" value={<a href={`/city/${toSlug(n.city)}`}>{n.city}</a>} />
              <Fact label="Country" value={<a href={`/country/${toSlug(n.country)}`}>{n.country}</a>} />
              <Fact label="Rank in city" value={`#${n.cityRank} of ${related.length + 1}`} />
              <Fact label="Sources" value={`${n.sources.length} editorial`} />
            </dl>
          </div>
        </aside>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container" style={{ marginTop: 72 }}>
          <div className="eyebrow">More in {n.city}</div>
          <h2 className="serif-display" style={{ fontSize: 34, fontWeight: 400, margin: '8px 0 24px', color: '#f5f0e8' }}>
            Other great neighborhoods in {n.city}
          </h2>
          <div className="grid-auto">
            {related.map((r) => (
              <a key={neighborhoodSlug(r)} href={`/neighborhood/${neighborhoodSlug(r)}`} className="card" style={{ padding: 20 }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase' }}>#{r.cityRank}</div>
                <div className="serif-display" style={{ fontSize: 22, color: '#f5f0e8', marginTop: 4 }}>{r.name}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 8, fontStyle: 'italic' }}>{r.tag}</div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Fact({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <dt style={{ color: 'var(--text-dim)' }}>{label}</dt>
      <dd style={{ margin: 0, color: '#f5f0e8' }}>{value}</dd>
    </div>
  );
}
