// components/PhotoGallery.js
// Server component — responsive photo grid using next/image so each tile gets
// AVIF/WebP variants, lazy loading and responsive srcsets. Image URLs come
// from Vercel Blob (public store) when available, with Wikimedia as fallback.

import Image from 'next/image';

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
              position: 'relative',
              display: 'block',
              aspectRatio: '4 / 3',
              overflow: 'hidden',
              background: '#1a1a1a',
              border: '1px solid var(--border)',
              borderRadius: 2,
            }}
            aria-label={`${name} photo ${i + 1}`}
          >
            <Image
              src={url}
              alt={`${name} photo ${i + 1}`}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 220px"
              style={{ objectFit: 'cover' }}
              loading="lazy"
              unoptimized={!url.includes('blob.vercel-storage.com')}
            />
          </a>
        ))}
      </div>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--text-dim)', marginTop: 14 }}>
        Photos from the Wikipedia article on {name}, available under the same CC BY-SA / public-domain terms as the source article.
      </p>
    </section>
  );
}
