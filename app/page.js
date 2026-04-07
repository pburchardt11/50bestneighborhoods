import { getAllCities, getAllCountries, getTop50, getStats, neighborhoodSlug, toSlug, cardImage } from '../lib/neighborhood-db';
import RandomButton from '../components/RandomButton';
import NewsletterForm from '../components/NewsletterForm';

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
            <RandomButton />
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
                <div className="rank-badge large">#{i + 1}</div>
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
        <ul style={{
          listStyle: 'none', padding: 0, margin: '36px 0 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 6,
        }}>
          {cities.map((c) => (
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
                }}
              >
                <span className="serif-display" style={{ fontSize: 17, color: '#f5f0e8', lineHeight: 1.2 }}>{c.name}</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: 'var(--text-dim)', letterSpacing: 0.5 }}>{c.count}</span>
              </a>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/cities" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--accent)' }}>
            All cities, grouped by country →
          </a>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container" style={{ marginTop: 80 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: 40, border: '1px solid var(--border)', background: 'rgba(201,162,75,0.04)' }}>
          <div className="eyebrow">The Dispatch</div>
          <h2 className="serif-display" style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 400, margin: '12px 0 14px', color: '#f5f0e8' }}>
            One neighborhood, every <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>Sunday</em>
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.7, marginBottom: 24, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            A short editorial dispatch every Sunday morning &mdash; one neighborhood, one travel-tip, one underrated city. No spam, ever.
          </p>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <NewsletterForm compact />
          </div>
        </div>
      </section>

      {/* BY COUNTRY */}
      <section className="container" style={{ marginTop: 80 }}>
        <SectionHeader eyebrow="Browse by Country" title="Countries" subtitle={`${countries.length} countries and counting.`} />
        <ul style={{
          listStyle: 'none', padding: 0, margin: '36px 0 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 6,
        }}>
          {countries.map((c) => (
            <li key={c.name}>
              <a
                href={`/country/${toSlug(c.name)}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 13px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.012)',
                  borderRadius: 2,
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{c.flag}</span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#f5f0e8' }}>{c.name}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: "'Outfit', sans-serif" }}>{c.count}</span>
              </a>
            </li>
          ))}
        </ul>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/countries" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--accent)' }}>
            All countries →
          </a>
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
