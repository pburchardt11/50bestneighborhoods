import { SignIn } from '@clerk/nextjs';

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata = {
  title: 'Sign in',
  description: 'Sign in to save neighborhoods and sync your wishlist across devices.',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="container" style={{ padding: '80px 0', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="eyebrow">Account</div>
      <h1 className="serif-display" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, margin: '14px 0 24px', color: '#f5f0e8', textAlign: 'center' }}>
        Sign in
      </h1>
      {clerkEnabled ? (
        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#c9a24b',
              colorBackground: '#121212',
              colorInputBackground: '#1a1a1a',
              colorInputText: '#f5f0e8',
              colorText: '#f5f0e8',
              colorTextSecondary: '#8f8a82',
              fontFamily: 'Outfit, sans-serif',
              borderRadius: '2px',
            },
          }}
        />
      ) : (
        <NotConfigured />
      )}
    </main>
  );
}

function NotConfigured() {
  return (
    <div style={{ maxWidth: 520, padding: 28, border: '1px solid var(--border)', background: 'rgba(201,162,75,0.04)', textAlign: 'center' }}>
      <p style={{ color: 'var(--text)', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
        Sign-in is not yet configured on this deployment. The site administrator
        needs to add Clerk environment variables (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        and CLERK_SECRET_KEY) and redeploy.
      </p>
      <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
        In the meantime, your favorites are saved on this device using your browser&rsquo;s
        local storage — they just won&rsquo;t sync across devices.
      </p>
    </div>
  );
}
