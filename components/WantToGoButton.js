'use client';

// WantToGoButton.js — uses the unified useFavs() hook so it automatically
// syncs to Clerk when the user is signed in, and falls back to localStorage
// otherwise. UI is unchanged.

import { useFavs } from '../lib/use-favs';

export default function WantToGoButton({ slug, name, city, country, tag }) {
  const { wishlist, hydrated, toggleWish } = useFavs();
  const inList = wishlist.some((x) => x.slug === slug);

  function onClick() {
    if (!hydrated) return;
    toggleWish({ slug, name, city, country, tag });
  }

  return (
    <button
      onClick={onClick}
      aria-label={inList ? 'Remove from wishlist' : 'Add to wishlist'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        background: inList ? 'rgba(135,180,255,0.18)' : 'transparent',
        color: inList ? '#b8d4ff' : '#9bb5e0',
        border: `1px solid ${inList ? '#7aa3e0' : 'rgba(155,181,224,0.4)'}`,
        borderRadius: 999,
        cursor: 'pointer',
        fontFamily: "'Outfit', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      }}
    >
      <span aria-hidden style={{ fontSize: 13 }}>{inList ? '✓' : '✈'}</span>
      {inList ? 'On the list' : 'Want to go'}
    </button>
  );
}
