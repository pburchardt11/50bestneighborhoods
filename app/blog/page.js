import { getAllPosts } from '../../lib/blog-data';

export const metadata = {
  title: 'Blog — Essays and guides on the world\'s best neighborhoods',
  description: 'Editorial essays, travel tips, and city guides from 50 Best Neighborhoods.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/blog' },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <main>
      <section style={{ padding: '80px 0 30px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="eyebrow">Journal</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px,8vw,104px)', fontWeight: 400, margin: '12px 0 6px', color: '#f5f0e8' }}>
            The <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>Journal</em>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 18, maxWidth: 720, lineHeight: 1.7 }}>
            Essays, guides and travel tips on choosing, visiting and understanding the world's best neighborhoods.
          </p>
        </div>
      </section>

      <section className="container" style={{ marginTop: 56 }}>
        <div style={{ display: 'grid', gap: 20 }}>
          {posts.map((p) => (
            <a key={p.slug} href={`/blog/${p.slug}`} className="card" style={{ padding: 28 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 2, color: 'var(--accent)', textTransform: 'uppercase' }}>
                {new Date(p.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })} · {p.tags.join(' · ')}
              </div>
              <h2 className="serif-display" style={{ fontSize: 36, fontWeight: 400, color: '#f5f0e8', margin: '10px 0 8px' }}>{p.title}</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>{p.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
