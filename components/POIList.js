// components/POIList.js
// Renders categorised lists of real points of interest pulled from
// OpenStreetMap via the Overpass API. Each item links to a Google Maps
// search for the venue name + neighborhood, which works as a soft fallback
// even when the OSM coordinates are stale.

function buildMapsUrl(item, neighborhood, city) {
  const q = encodeURIComponent(`${item.name} ${neighborhood} ${city}`);
  if (item.lat && item.lon) {
    return `https://www.google.com/maps/search/${q}/@${item.lat},${item.lon},17z`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function Section({ title, icon, items, neighborhood, city, renderMeta }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 className="serif-display" style={{ fontSize: 22, fontWeight: 400, color: '#f5f0e8', margin: 0 }}>{title}</h3>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1 }}>
          · {items.length}
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
        {items.map((item, i) => (
          <li key={`${item.name}-${i}`}>
            <a
              href={buildMapsUrl(item, neighborhood, city)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: 2,
                background: 'rgba(255,255,255,0.015)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <div style={{ color: '#f5f0e8', fontSize: 14, fontWeight: 500, lineHeight: 1.35 }}>{item.name}</div>
              {renderMeta && renderMeta(item) && (
                <div style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: "'Outfit', sans-serif", marginTop: 2, letterSpacing: 0.4 }}>
                  {renderMeta(item)}
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function POIList({ pois, neighborhood, city }) {
  if (!pois) return null;
  const total = (pois.restaurants?.length || 0)
    + (pois.cafes?.length || 0)
    + (pois.bars?.length || 0)
    + (pois.shops?.length || 0)
    + (pois.culture?.length || 0)
    + (pois.parks?.length || 0);
  if (total === 0) return null;

  return (
    <section className="container" style={{ marginTop: 72 }}>
      <div className="eyebrow">Real venues nearby</div>
      <h2 className="serif-display" style={{ fontSize: 34, fontWeight: 400, margin: '8px 0 22px', color: '#f5f0e8' }}>
        What&rsquo;s in {neighborhood}
      </h2>
      <Section
        title="Restaurants"
        icon="🍽️"
        items={pois.restaurants}
        neighborhood={neighborhood}
        city={city}
        renderMeta={(item) => item.cuisine}
      />
      <Section
        title="Cafés"
        icon="☕"
        items={pois.cafes}
        neighborhood={neighborhood}
        city={city}
      />
      <Section
        title="Bars & Clubs"
        icon="🍸"
        items={pois.bars}
        neighborhood={neighborhood}
        city={city}
      />
      <Section
        title="Shops"
        icon="🛍️"
        items={pois.shops}
        neighborhood={neighborhood}
        city={city}
        renderMeta={(item) => item.shop}
      />
      <Section
        title="Museums, galleries & sights"
        icon="🖼️"
        items={pois.culture}
        neighborhood={neighborhood}
        city={city}
        renderMeta={(item) => item.kind}
      />
      <Section
        title="Parks & gardens"
        icon="🌳"
        items={pois.parks}
        neighborhood={neighborhood}
        city={city}
      />
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--text-dim)', marginTop: 18 }}>
        Venue data from <a style={{ color: 'var(--accent)' }} href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, ODbL. Click any name to open in Google Maps.
      </p>
    </section>
  );
}
