import { getAllCities, getAllCountries, getTop50, getStats, neighborhoodSlug, toSlug, cardImage } from '../lib/neighborhood-db';

export const metadata = {
  title: "50 Best Neighborhoods — The World's Greatest City Districts, Ranked",
  description: "Editorial guide to the best neighborhoods in cities around the world — from Williamsburg to Shoreditch, Shimokitazawa to Palermo Soho.",
  alternates: { canonical: 'https://www.50bestneighborhoods.com' },
};

export default function HomePage() {
  const cities = getAllCities();
  const countries = getAllCountries();
  const top = getTop50();
  const stats = getStats();

  return (
    <main>
      {/* HERO */}
      <section style={{
        position: 'relative', minHeight: '72vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', overflow: 'hidden', padding: '60px 24px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 40%, rgba(201,162,75,0.10) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(60,80,120,0.08) 0%, transparent 50%), #0a0a0a',
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900 }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            {stats.neighborhoods} Neighborhoods · {stats.cities} Cities · {stats.countries} Countries
          </div>
          <h1 className="serif-display" style={{
            fontSize: 'clamp(44px, 8vw, 104px)',
            fontWeight: 300, lineHeight: 0.95, margin: 0, color: '#f5f0e8',
          }}>
            The World{"'"}s Best<br />
            <em style={{ color: '#c9a24b', fontStyle: 'italic', fontWeight: 500 }}>Neighborhoods</em>
          </h1>
          <p style={{
            marginTop: 30, fontSize: 18, lineHeight: 1.7, color: 'var(--text-dim)',
            maxWidth: 680, marginLeft: 'auto', marginRight: 'auto',
          }}>
            An editorial reference guide to the greatest districts in every major city. Rankings synthesized from Time Out, Condé Nast Traveler, The New York Times, The Guardian and leading local press.
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/top-50" style={btnPrimary}>Browse the Top 50</a>
            <a href="/cities" style={btnGhost}>All Cities</a>
          </div>
        </div>
      </section>

      {/* TOP 50 */}
      <section className="container" style={{ marginTop: 40 }}>
        <SectionHeader eyebrow="The Global Ranking" title="The 50 Best Neighborhoods" subtitle="One flagship district per city, ranked by editorial consensus." />
        <div className="grid-auto" style={{ marginTop: 36 }}>
          {top.map((n, i) => (
            <a key={neighborhoodSlug(n)} href={`/neighborhood/${neighborhoodSlug(n)}`} className="card" style={{ padding: 0, overflow: 'hidden', display: 'block' }}>
              <div style={{
                height: 200,
                background: `linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.9) 100%), url('${cardImage(n)}') center/cover no-repeat, #1a1a1a`,
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(201,162,75,0.18)', color: '#c9a24b', border: '1px solid rgba(201,162,75,0.4)', padding: '4px 10px', fontSize: 11, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  #{i + 1}
                </div>
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#c9a24b' }}>{n.city}, {n.country}</div>
                  <div className="serif-display" style={{ fontSize: 24, color: '#f5f0e8', marginTop: 2 }}>{n.name}</div>
                </div>
              </div>
              <div style={{ padding: '14px 16px 18px', color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.55 }}>
                <em>{n.tag}</em>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* BY CITY */}
      <section className="container" style={{ marginTop: 80 }}>
        <SectionHeader eyebrow="Browse by City" title="Cities" subtitle={`${cities.length} world cities covered, 5 neighborhoods each.`} />
        <div className="grid-auto" style={{ marginTop: 36 }}>
          {cities.map((c) => (
            <a key={c.name} href={`/city/${toSlug(c.name)}`} className="card" style={{ padding: 24 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 2, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{c.country}</div>
              <div className="serif-display" style={{ fontSize: 28, marginTop: 6, color: '#f5f0e8' }}>{c.name}</div>
              <div style={{ marginTop: 12, fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'var(--accent)' }}>{c.count} neighborhoods →</div>
            </a>
          ))}
        </div>
      </section>

      {/* BY COUNTRY */}
      <section className="container" style={{ marginTop: 80 }}>
        <SectionHeader eyebrow="Browse by Country" title="Countries" subtitle={`${countries.length} countries and counting.`} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
          {countries.map((c) => (
            <a key={c.name} href={`/country/${toSlug(c.name)}`} className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{c.flag}</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, letterSpacing: 0.5 }}>{c.name}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>· {c.count}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="serif-display" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, margin: '10px 0 6px', color: '#f5f0e8' }}>{title}</h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 15, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

const btnPrimary = {
  display: 'inline-block', padding: '14px 28px',
  background: 'linear-gradient(135deg, #c9a24b, #8a6e32)', color: '#0a0a0a',
  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
  border: 'none', borderRadius: 2,
};
const btnGhost = {
  display: 'inline-block', padding: '14px 28px',
  background: 'transparent', color: '#c9a24b', border: '1px solid rgba(201,162,75,0.4)',
  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase',
  borderRadius: 2,
};
