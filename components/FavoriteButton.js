'use client';

// FavoriteButton.js — localStorage-backed favorites with no account required.
// Stores a JSON-encoded array of neighborhood slugs under the key "favs:v1".
// Future upgrade path: swap localStorage for Clerk + Neon when accounts ship.

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

function writeFavs(favs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(favs));
    // Notify other components on the same page
    window.dispatchEvent(new CustomEvent('favs:changed', { detail: { favs } }));
  } catch {}
}

export default function FavoriteButton({ slug, name, city, country, tag }) {
  const [favs, setFavs] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavs(readFavs());
    setHydrated(true);
    const onChange = (e) => setFavs(e.detail?.favs || readFavs());
    window.addEventListener('favs:changed', onChange);
    return () => window.removeEventListener('favs:changed', onChange);
  }, []);

  // We persist the slug only; the /favorites page enriches by looking up the
  // slug in the static dataset, so the stored payload stays tiny.
  const isFav = favs.some((f) => f.slug === slug);

  function toggle() {
    if (!hydrated) return;
    const next = isFav
      ? favs.filter((f) => f.slug !== slug)
      : [...favs, { slug, name, city, country, tag, addedAt: Date.now() }];
    writeFavs(next);
    setFavs(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        background: isFav ? 'rgba(201,162,75,0.18)' : 'transparent',
        color: isFav ? '#e6c581' : '#c9a24b',
        border: `1px solid ${isFav ? '#c9a24b' : 'rgba(201,162,75,0.4)'}`,
        borderRadius: 999,
        cursor: 'pointer',
        fontFamily: "'Outfit', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      }}
    >
      <span aria-hidden style={{ fontSize: 14 }}>{isFav ? '★' : '☆'}</span>
      {isFav ? 'Saved' : 'Save'}
    </button>
  );
}
