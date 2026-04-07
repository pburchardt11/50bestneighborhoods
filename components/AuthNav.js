// AuthNav.js — server component that conditionally renders Clerk's UserButton
// when env vars are present, or a "Sign in" link when they aren't (or when
// the user is signed out). Safe to use anywhere in the layout.

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function AuthNav() {
  if (!clerkEnabled) {
    // Sign-in not configured yet — link still works but lands on the placeholder page
    return (
      <a
        href="/sign-in"
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: 'var(--accent)',
        }}
      >
        Sign in
      </a>
    );
  }

  return (
    <>
      <SignedOut>
        <a
          href="/sign-in"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          Sign in
        </a>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            variables: {
              colorPrimary: '#c9a24b',
            },
          }}
        />
      </SignedIn>
    </>
  );
}
