'use client';

import { useEffect, useState } from 'react';

const KEYS = {
  saved: 'favs:v1',
  wishlist: 'wishlist:v1',
};
const EVENTS = {
  saved: 'favs:changed',
  wishlist: 'wishlist:changed',
};
const TITLES = {
  saved: 'Saved',
  wishlist: 'Want to go',
};
const ICONS = {
  saved: '★',
  wishlist: '✈',
};
const COLORS = {
  saved: '#c9a24b',
  wishlist: '#9bb5e0',
};

function readList(key) {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Section({ kind, items, onRemove, onClear }) {
  if (items.length === 0) return null;
  return (
    <section style={{ marginBottom: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <h2 className="serif-display" style={{ fontSize: 28, fontWeight: 400, color: '#f5f0e8', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: COLORS[kind], fontSize: 22 }}>{ICONS[kind]}</span>
          {TITLES[kind]}
          <span style={{ color: 'var(--text-dim)', fontSize: 14, fontFamily: "'Outfit', sans-serif", letterSpacing: 1.2 }}>· {items.length}</span>
        </h2>
        <button
          onClick={() => onClear(kind)}
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
          Clear
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {items.slice().reverse().map((f) => (
          <li key={f.slug} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.012)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                {f.city}, {f.country}
              </div>
              <a href={`/neighborhood/${f.slug}`} className="serif-display" style={{ fontSize: 22, color: '#f5f0e8', display: 'block', marginTop: 2 }}>
                {f.name}
              </a>
              {f.tag && <div style={{ color: COLORS[kind], fontStyle: 'italic', fontSize: 13, marginTop: 4 }}>{f.tag}</div>}
            </div>
            <a
              href={`/neighborhood/${f.slug}`}
              style={{ color: 'var(--accent)', fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >
              View →
            </a>
            <button
              onClick={() => onRemove(kind, f.slug)}
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

export default function FavoritesList() {
  const [saved, setSaved] = useState(null);
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    setSaved(readList(KEYS.saved));
    setWishlist(readList(KEYS.wishlist));
    const onSavedChange = () => setSaved(readList(KEYS.saved));
    const onWishlistChange = () => setWishlist(readList(KEYS.wishlist));
    window.addEventListener(EVENTS.saved, onSavedChange);
    window.addEventListener(EVENTS.wishlist, onWishlistChange);
    window.addEventListener('storage', () => { onSavedChange(); onWishlistChange(); });
    return () => {
      window.removeEventListener(EVENTS.saved, onSavedChange);
      window.removeEventListener(EVENTS.wishlist, onWishlistChange);
    };
  }, []);

  function remove(kind, slug) {
    const current = kind === 'saved' ? saved : wishlist;
    const next = (current || []).filter((f) => f.slug !== slug);
    localStorage.setItem(KEYS[kind], JSON.stringify(next));
    if (kind === 'saved') setSaved(next);
    else setWishlist(next);
    window.dispatchEvent(new CustomEvent(EVENTS[kind], { detail: { [kind === 'saved' ? 'favs' : 'list']: next } }));
  }

  function clear(kind) {
    if (!confirm(`Clear all ${TITLES[kind].toLowerCase()} from this device?`)) return;
    localStorage.removeItem(KEYS[kind]);
    if (kind === 'saved') setSaved([]);
    else setWishlist([]);
    window.dispatchEvent(new CustomEvent(EVENTS[kind], { detail: { [kind === 'saved' ? 'favs' : 'list']: [] } }));
  }

  if (saved === null || wishlist === null) {
    return (
      <section className="container" style={{ marginTop: 56, color: 'var(--text-dim)' }}>
        Loading…
      </section>
    );
  }

  const total = saved.length + wishlist.length;

  if (total === 0) {
    return (
      <section className="container" style={{ marginTop: 56, textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>★ ✈</div>
        <h2 className="serif-display" style={{ fontSize: 28, fontWeight: 400, color: '#f5f0e8' }}>No collection yet</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 15, marginTop: 10, marginBottom: 24, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          On any neighborhood page, tap <strong style={{ color: '#c9a24b' }}>★ Save</strong> for places you love or <strong style={{ color: '#9bb5e0' }}>✈ Want to go</strong> to build your travel wishlist.
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
      <Section kind="saved" items={saved} onRemove={remove} onClear={clear} />
      <Section kind="wishlist" items={wishlist} onRemove={remove} onClear={clear} />
    </section>
  );
}
