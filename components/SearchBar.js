'use client';

import { useEffect, useRef, useState } from 'react';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef(null);

  // Lazy-load the index on first focus
  async function loadIndex() {
    if (index) return;
    try {
      const res = await fetch('/api/search-index');
      const data = await res.json();
      setIndex(data);
    } catch {}
  }

  // Close on outside click
  useEffect(() => {
    function onClick(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const results = (() => {
    if (!q || !index) return [];
    const needle = q.toLowerCase();
    const scored = [];
    for (const item of index) {
      const name = item.name.toLowerCase();
      const city = (item.city || '').toLowerCase();
      const country = (item.country || '').toLowerCase();
      const hay = `${name} ${city} ${country}`;
      if (!hay.includes(needle)) continue;
      // Score: exact prefix match on name > contains in name > matches elsewhere
      let score = 0;
      if (name.startsWith(needle)) score += 100;
      else if (name.includes(needle)) score += 50;
      if (city.startsWith(needle)) score += 20;
      if (country.startsWith(needle)) score += 10;
      // Prefer neighborhoods and cities over countries
      if (item.type === 'neighborhood') score += 5;
      if (item.type === 'city') score += 3;
      scored.push({ item, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map((x) => x.item);
  })();

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); window.location.href = results[activeIdx].url; }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
      <input
        type="text"
        value={q}
        placeholder="Search neighborhoods, cities, countries…"
        onFocus={() => { setOpen(true); loadIndex(); }}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onKeyDown={onKeyDown}
        style={{
          width: '100%',
          padding: '9px 14px',
          background: 'rgba(255,255,255,0.05)',
          color: '#f5f0e8',
          border: '1px solid rgba(201,162,75,0.25)',
          borderRadius: 2,
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          letterSpacing: 0.3,
          outline: 'none',
        }}
      />
      {open && q && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#121212', border: '1px solid rgba(201,162,75,0.25)',
          maxHeight: 360, overflowY: 'auto', zIndex: 100,
          boxShadow: '0 8px 28px rgba(0,0,0,0.7)',
        }}>
          {results.length === 0 ? (
            <div style={{ padding: 14, color: 'var(--text-dim)', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
              {index ? 'No matches.' : 'Loading index…'}
            </div>
          ) : results.map((r, i) => (
            <a
              key={r.url}
              href={r.url}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                display: 'block', padding: '10px 14px',
                borderBottom: i === results.length - 1 ? 'none' : '1px solid rgba(201,162,75,0.08)',
                background: i === activeIdx ? 'rgba(201,162,75,0.08)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 2 }}>
                {r.type}
              </div>
              <div className="serif-display" style={{ fontSize: 16, color: '#f5f0e8' }}>{r.name}</div>
              {r.city && <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{r.city}, {r.country}</div>}
              {!r.city && r.country && <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{r.country}</div>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
