'use client';

// FavoriteButton.js — uses the unified useFavs() hook so it automatically
// syncs to Clerk when the user is signed in, and falls back to localStorage
// otherwise. UI is unchanged.

import { useFavs } from '../lib/use-favs';

export default function FavoriteButton({ slug, name, city, country, tag }) {
  const { favs, hydrated, toggleFav } = useFavs();
  const isFav = favs.some((f) => f.slug === slug);

  function onClick() {
    if (!hydrated) return;
    toggleFav({ slug, name, city, country, tag });
  }

  return (
    <button
      onClick={onClick}
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
