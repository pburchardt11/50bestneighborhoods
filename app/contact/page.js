export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <main className="container" style={{ padding: '80px 0', maxWidth: 780, color: 'var(--text)', fontSize: 16, lineHeight: 1.7 }}>
      <h1 className="serif-display" style={{ fontSize: 56, fontWeight: 400, color: '#f5f0e8', marginBottom: 20 }}>Contact</h1>
      <p>Editorial tips, neighborhood nominations, and corrections: <a style={{ color: 'var(--accent)' }} href="mailto:contact@50bestneighborhoods.com">contact@50bestneighborhoods.com</a></p>
    </main>
  );
}
