'use client';

// WantToGoButton.js — sibling of FavoriteButton. Stores neighborhoods you
// want to visit, separate from the "saved" list. Same localStorage pattern
// (key: "wishlist:v1") so the two stores stay independent.

import { useEffect, useState } from 'react';

const KEY = 'wishlist:v1';

function readList() {
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

function writeList(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('wishlist:changed', { detail: { list } }));
  } catch {}
}

export default function WantToGoButton({ slug, name, city, country, tag }) {
  const [list, setList] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setList(readList());
    setHydrated(true);
    const onChange = (e) => setList(e.detail?.list || readList());
    window.addEventListener('wishlist:changed', onChange);
    return () => window.removeEventListener('wishlist:changed', onChange);
  }, []);

  const inList = list.some((x) => x.slug === slug);

  function toggle() {
    if (!hydrated) return;
    const next = inList
      ? list.filter((x) => x.slug !== slug)
      : [...list, { slug, name, city, country, tag, addedAt: Date.now() }];
    writeList(next);
    setList(next);
  }

  return (
    <button
      onClick={toggle}
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
