import { SignIn } from '@clerk/nextjs';

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
    </main>
  );
}
