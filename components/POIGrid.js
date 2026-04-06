// components/POIGrid.js
// Six-tile grid of category discovery links (restaurants, cafés, bars, shops, museums, hotels).

export default function POIGrid({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
      {items.map((p) => (
        <a
          key={p.category}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 24, lineHeight: 1 }}>{p.icon}</span>
          <span>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Discover
            </div>
            <div className="serif-display" style={{ fontSize: 17, color: '#f5f0e8', marginTop: 1 }}>{p.category}</div>
          </span>
        </a>
      ))}
    </div>
  );
}
