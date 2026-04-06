'use client';

import { useEffect, useState } from 'react';

const KEY = 'favs:v1';

function readFavs() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function FavoritesList() {
  const [favs, setFavs] = useState(null);

  useEffect(() => {
    setFavs(readFavs());
    const onChange = () => setFavs(readFavs());
    window.addEventListener('favs:changed', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('favs:changed', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  function clear() {
    if (!confirm('Remove all favorites from this device?')) return;
    localStorage.removeItem(KEY);
    setFavs([]);
    window.dispatchEvent(new CustomEvent('favs:changed', { detail: { favs: [] } }));
  }

  function remove(slug) {
    const next = (favs || []).filter((f) => f.slug !== slug);
    localStorage.setItem(KEY, JSON.stringify(next));
    setFavs(next);
    window.dispatchEvent(new CustomEvent('favs:changed', { detail: { favs: next } }));
  }

  if (favs === null) {
    return (
      <section className="container" style={{ marginTop: 56, color: 'var(--text-dim)' }}>
        Loading…
      </section>
    );
  }

  if (favs.length === 0) {
    return (
      <section className="container" style={{ marginTop: 56, textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>☆</div>
        <h2 className="serif-display" style={{ fontSize: 28, fontWeight: 400, color: '#f5f0e8' }}>No favorites yet</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 15, marginTop: 10, marginBottom: 24, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Tap the &ldquo;Save&rdquo; star on any neighborhood page to add it to your collection.
        </p>
        <a
          href="/top-50"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #c9a24b, #8a6e32)',
            color: '#0a0a0a',
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            borderRadius: 2,
          }}
        >
          Browse the Top 50
        </a>
      </section>
    );
  }

  return (
    <section className="container" style={{ marginTop: 56, marginBottom: 60 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div className="eyebrow">{favs.length} saved</div>
        <button
          onClick={clear}
          style={{
            background: 'transparent',
            border: '1px solid rgba(229,115,115,0.4)',
            color: '#e57373',
            padding: '6px 14px',
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          Clear all
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
        {favs.slice().reverse().map((f) => (
          <li key={f.slug} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                {f.city}, {f.country}
              </div>
              <a href={`/neighborhood/${f.slug}`} className="serif-display" style={{ fontSize: 24, color: '#f5f0e8', display: 'block', marginTop: 2 }}>
                {f.name}
              </a>
              {f.tag && <div style={{ color: '#c9a24b', fontStyle: 'italic', fontSize: 14, marginTop: 4 }}>{f.tag}</div>}
            </div>
            <a
              href={`/neighborhood/${f.slug}`}
              style={{ color: 'var(--accent)', fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >
              View →
            </a>
            <button
              onClick={() => remove(f.slug)}
              aria-label={`Remove ${f.name}`}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: 22,
                cursor: 'pointer',
                lineHeight: 1,
                padding: 4,
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
