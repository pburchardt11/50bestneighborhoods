// components/PhotoGallery.js
// Server component — renders a small responsive photo grid using image URLs
// pulled from the Wikipedia media-list API. All images are CC-licensed and
// link back to the source article for attribution.

export default function PhotoGallery({ images, name, wikiUrl }) {
  if (!images || images.length === 0) return null;
  return (
    <section className="container" style={{ marginTop: 72 }}>
      <div className="eyebrow">From Wikimedia Commons</div>
      <h2 className="serif-display" style={{ fontSize: 34, fontWeight: 400, margin: '8px 0 18px', color: '#f5f0e8' }}>
        {name} in pictures
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {images.map((url, i) => (
          <a
            key={i}
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              aspectRatio: '4 / 3',
              background: `url('${url}') center/cover no-repeat, #1a1a1a`,
              border: '1px solid var(--border)',
              borderRadius: 2,
              transition: 'transform 0.2s, border-color 0.2s',
            }}
            aria-label={`${name} photo ${i + 1}`}
          />
        ))}
      </div>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--text-dim)', marginTop: 14 }}>
        Photos from the Wikipedia article on {name}, available under the same CC BY-SA / public-domain terms as the source article.
      </p>
    </section>
  );
}
