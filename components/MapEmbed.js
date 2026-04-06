// components/MapEmbed.js
// Small OpenStreetMap iframe around the neighborhood's coordinates, with
// a click-to-open link to Google Maps for a richer experience.

export default function MapEmbed({ coords, name, city, pinUrl }) {
  if (!coords?.lat || !coords?.lon) return null;
  const { lat, lon } = coords;
  const delta = 0.008;
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join(',');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden', background: '#0d0d0d' }}>
      <iframe
        title={`Map of ${name}, ${city}`}
        src={src}
        width="100%"
        height="320"
        loading="lazy"
        style={{ border: 0, display: 'block', filter: 'grayscale(0.3) brightness(0.85)' }}
      />
      <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Outfit', sans-serif", fontSize: 12 }}>
        <span style={{ color: 'var(--text-dim)' }}>© OpenStreetMap contributors</span>
        <a href={pinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
}
