import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import SearchBar from '../components/SearchBar';
import LanguageToggle from '../components/LanguageToggle';

export const metadata = {
  metadataBase: new URL('https://www.50bestneighborhoods.com'),
  title: {
    default: "50 Best Neighborhoods — The World's Greatest City Districts, Ranked",
    template: '%s | 50 Best Neighborhoods',
  },
  description: "Your editorial guide to the world's best neighborhoods. City-by-city rankings of the greatest districts in London, New York, Tokyo, Paris, Mexico City and beyond — with sources from Time Out, Condé Nast Traveler and more.",
  keywords: ['best neighborhoods', 'neighborhood guide', 'city districts', 'travel guide', 'coolest neighborhoods', 'where to stay'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.50bestneighborhoods.com',
    siteName: '50 Best Neighborhoods',
    title: "50 Best Neighborhoods — The World's Greatest City Districts, Ranked",
    description: "Your editorial guide to the world's best neighborhoods, city by city.",
  },
  twitter: {
    card: 'summary_large_image',
    title: "50 Best Neighborhoods",
    description: "The world's greatest city districts, editorially ranked.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.50bestneighborhoods.com' },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
  verification: {
    google: 'd_EUxmX_PspSV6FZJVO1uPO6vAehJgXADVnhYEgYNdU',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '14px 0',
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 30, fontWeight: 700,
                background: 'linear-gradient(135deg, #c9a24b, #e6c581, #c9a24b)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: -1, lineHeight: 1,
              }}>50</span>
              <span style={{ width: 1, height: 26, background: 'linear-gradient(to bottom, transparent, #c9a24b, transparent)', opacity: 0.5 }} />
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: 3, color: '#c9a24b', opacity: 0.85, lineHeight: 1 }}>BEST</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 21, fontWeight: 400, fontStyle: 'italic', color: '#f5f0e8', letterSpacing: 1, lineHeight: 1.15 }}>Neighborhoods</span>
              </span>
            </a>
            <div style={{ flex: '1 1 320px', maxWidth: 420, margin: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <SearchBar />
            </div>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 22, fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              <a href="/cities">Cities</a>
              <a href="/countries">Countries</a>
              <a href="/top-50">Top 50</a>
              <a href="/blog">Blog</a>
              <a href="/favorites" aria-label="My favorites">★</a>
              <a href="/about">About</a>
            </div>
          </div>
        </nav>
        {children}
        <footer style={{ borderTop: '1px solid var(--border)', marginTop: 80, padding: '40px 0 30px', color: 'var(--text-dim)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12 }}>
            <div>© {new Date().getFullYear()} 50 Best Neighborhoods. Editorial guide.</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <a href="/about">About</a>
              <a href="/blog">Journal</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
          <div className="container" style={{ marginTop: 22, fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 900 }}>
            Encyclopedic neighborhood content on this site is adapted from Wikipedia and used under the{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
              Creative Commons Attribution-ShareAlike 4.0 licence
            </a>. Editorial rankings, commentary and original prose are © 50 Best Neighborhoods. External publications are linked for reference only.
          </div>
        </footer>
        <LanguageToggle />
        <Analytics />
      </body>
    </html>
  );
}
