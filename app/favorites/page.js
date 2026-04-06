import FavoritesList from '../../components/FavoritesList';

export const metadata = {
  title: 'My favorites',
  description: 'Neighborhoods you have saved on this device.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/favorites' },
  robots: { index: false, follow: false },
};

export default function FavoritesPage() {
  return (
    <main>
      <section style={{ padding: '80px 0 30px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow">Your collection</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px,8vw,104px)', fontWeight: 400, margin: '14px 0 14px', color: '#f5f0e8' }}>
            My <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>favorites</em>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 18, lineHeight: 1.7, maxWidth: 720 }}>
            Neighborhoods you have saved on this device. Stored privately in your browser &mdash; no account needed.
          </p>
        </div>
      </section>

      <FavoritesList />
    </main>
  );
}
