'use client';

// lib/use-favs.js
// Single source of truth for favorites + wishlist. When signed out, reads/writes
// localStorage. When signed in, syncs to Clerk's publicMetadata via /api/sync-favs.
//
// On first sign-in, automatically migrates any existing localStorage entries
// into the user's Clerk metadata, then clears localStorage so the same device
// can host multiple users without leaking each other's data.
//
// Conflict resolution: when local and remote both have entries, they merge by
// slug (union, with the most recent addedAt winning).

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

const KEYS = { favs: 'favs:v1', wishlist: 'wishlist:v1' };
const EVENTS = { favs: 'favs:changed', wishlist: 'wishlist:changed' };
const MIGRATED_FLAG = 'favs:migrated:v1';

function readLocal(key) {
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

function writeLocal(key, list, eventName) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(eventName, { detail: { list } }));
  } catch {}
}

function mergeBySlug(a = [], b = []) {
  const map = new Map();
  for (const item of [...a, ...b]) {
    if (!item?.slug) continue;
    const existing = map.get(item.slug);
    if (!existing || (item.addedAt || 0) > (existing.addedAt || 0)) {
      map.set(item.slug, item);
    }
  }
  return Array.from(map.values());
}

async function fetchRemote() {
  try {
    const res = await fetch('/api/sync-favs');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function pushRemote(payload) {
  try {
    const res = await fetch('/api/sync-favs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function useFavs() {
  const { isLoaded, isSignedIn } = useUser();
  const [favs, setFavs] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load on mount + listen for cross-component updates
  useEffect(() => {
    setFavs(readLocal(KEYS.favs));
    setWishlist(readLocal(KEYS.wishlist));
    setHydrated(true);

    const onFavsChange = (e) => setFavs(e.detail?.list || readLocal(KEYS.favs));
    const onWishChange = (e) => setWishlist(e.detail?.list || readLocal(KEYS.wishlist));
    window.addEventListener(EVENTS.favs, onFavsChange);
    window.addEventListener(EVENTS.wishlist, onWishChange);
    return () => {
      window.removeEventListener(EVENTS.favs, onFavsChange);
      window.removeEventListener(EVENTS.wishlist, onWishChange);
    };
  }, []);

  // When the user signs in, merge local + remote and persist back to Clerk.
  // Runs at most once per device per user (gated by MIGRATED_FLAG).
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !hydrated) return;
    const flagKey = `${MIGRATED_FLAG}`;
    if (localStorage.getItem(flagKey) === '1') {
      // Already migrated on this device — just pull remote and replace local cache
      fetchRemote().then((remote) => {
        if (!remote) return;
        setFavs(remote.favs || []);
        setWishlist(remote.wishlist || []);
        writeLocal(KEYS.favs, remote.favs || [], EVENTS.favs);
        writeLocal(KEYS.wishlist, remote.wishlist || [], EVENTS.wishlist);
      });
      return;
    }

    // First sign-in on this device: merge local with whatever's already in Clerk
    (async () => {
      const localFavs = readLocal(KEYS.favs);
      const localWish = readLocal(KEYS.wishlist);
      const remote = (await fetchRemote()) || { favs: [], wishlist: [] };
      const mergedFavs = mergeBySlug(localFavs, remote.favs || []);
      const mergedWish = mergeBySlug(localWish, remote.wishlist || []);
      const result = await pushRemote({ favs: mergedFavs, wishlist: mergedWish });
      if (result) {
        setFavs(result.favs);
        setWishlist(result.wishlist);
        writeLocal(KEYS.favs, result.favs, EVENTS.favs);
        writeLocal(KEYS.wishlist, result.wishlist, EVENTS.wishlist);
        localStorage.setItem(flagKey, '1');
      }
    })();
  }, [isLoaded, isSignedIn, hydrated]);

  // Toggle helpers — write locally immediately for responsiveness, then sync remote in background
  const toggleFav = useCallback((entry) => {
    const inList = favs.some((f) => f.slug === entry.slug);
    const next = inList
      ? favs.filter((f) => f.slug !== entry.slug)
      : [...favs, { ...entry, addedAt: Date.now() }];
    setFavs(next);
    writeLocal(KEYS.favs, next, EVENTS.favs);
    if (isSignedIn) pushRemote({ favs: next });
  }, [favs, isSignedIn]);

  const toggleWish = useCallback((entry) => {
    const inList = wishlist.some((f) => f.slug === entry.slug);
    const next = inList
      ? wishlist.filter((f) => f.slug !== entry.slug)
      : [...wishlist, { ...entry, addedAt: Date.now() }];
    setWishlist(next);
    writeLocal(KEYS.wishlist, next, EVENTS.wishlist);
    if (isSignedIn) pushRemote({ wishlist: next });
  }, [wishlist, isSignedIn]);

  const removeFav = useCallback((slug) => {
    const next = favs.filter((f) => f.slug !== slug);
    setFavs(next);
    writeLocal(KEYS.favs, next, EVENTS.favs);
    if (isSignedIn) pushRemote({ favs: next });
  }, [favs, isSignedIn]);

  const removeWish = useCallback((slug) => {
    const next = wishlist.filter((f) => f.slug !== slug);
    setWishlist(next);
    writeLocal(KEYS.wishlist, next, EVENTS.wishlist);
    if (isSignedIn) pushRemote({ wishlist: next });
  }, [wishlist, isSignedIn]);

  const clearFavs = useCallback(() => {
    setFavs([]);
    writeLocal(KEYS.favs, [], EVENTS.favs);
    if (isSignedIn) pushRemote({ favs: [] });
  }, [isSignedIn]);

  const clearWish = useCallback(() => {
    setWishlist([]);
    writeLocal(KEYS.wishlist, [], EVENTS.wishlist);
    if (isSignedIn) pushRemote({ wishlist: [] });
  }, [isSignedIn]);

  return {
    favs,
    wishlist,
    hydrated,
    isSignedIn: !!isSignedIn,
    toggleFav,
    toggleWish,
    removeFav,
    removeWish,
    clearFavs,
    clearWish,
  };
}
