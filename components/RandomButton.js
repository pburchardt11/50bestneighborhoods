'use client';

// RandomButton.js — small client-side "explore a random neighborhood" action.
// Loads the static search index (already prebuilt for SearchBar) and picks
// a random neighborhood slug on click. Zero extra server routes.

import { useState } from 'react';

export default function RandomButton({ style }) {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch('/api/search-index');
      const data = await res.json();
      const neighborhoods = data.filter((d) => d.type === 'neighborhood');
      const pick = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
      if (pick) window.location.href = pick.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '14px 28px',
        background: 'transparent',
        color: '#c9a24b',
        border: '1px solid rgba(201,162,75,0.4)',
        fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
        letterSpacing: 2, textTransform: 'uppercase',
        borderRadius: 2, cursor: 'pointer',
        ...(style || {}),
      }}
    >
      <span aria-hidden>✦</span>
      {loading ? 'Loading…' : 'Random Neighborhood'}
    </button>
  );
}
