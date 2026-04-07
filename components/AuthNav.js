'use client';

// AuthNav.js — client component so the rest of the app stays statically
// prerendered. Uses Clerk's client hooks: useUser() returns the current user
// (null if signed out) and useClerk() exposes the imperative client APIs.

import { UserButton, useUser } from '@clerk/nextjs';

const SIGN_IN_LINK_STYLE = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: 12,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: 'var(--accent)',
};

export default function AuthNav() {
  const { isLoaded, isSignedIn } = useUser();

  // Render a stable placeholder during the SSR/hydration mismatch window
  if (!isLoaded) {
    return <span style={{ ...SIGN_IN_LINK_STYLE, opacity: 0 }}>Sign in</span>;
  }

  if (!isSignedIn) {
    return <a href="/sign-in" style={SIGN_IN_LINK_STYLE}>Sign in</a>;
  }

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{ variables: { colorPrimary: '#c9a24b' } }}
    />
  );
}
