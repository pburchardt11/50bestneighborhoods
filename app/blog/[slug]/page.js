import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '../../../lib/blog-data';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `https://www.50bestneighborhoods.com/blog/${p.slug}` },
    openGraph: { title: p.title, description: p.excerpt, type: 'article', publishedTime: p.date },
  };
}

export default function BlogPostPage({ params }) {
  const p = getPost(params.slug);
  if (!p) notFound();

  return (
    <main>
      <section style={{ padding: '80px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ display: 'flex', gap: 10, fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 14 }}>
            <a href="/">Home</a> <span>/</span> <a href="/blog">Journal</a>
          </div>
          <div className="eyebrow">{new Date(p.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, margin: '14px 0 14px', color: '#f5f0e8', lineHeight: 1.08 }}>
            {p.title}
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: 1.6 }}>{p.excerpt}</p>
          <div style={{ marginTop: 16, fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'var(--text-dim)' }}>By {p.author}</div>
        </div>
      </section>

      <article className="container" style={{ maxWidth: 720, padding: '50px 0' }}>
        {p.body.map((para, i) => (
          <p key={i} style={{ fontSize: 19, lineHeight: 1.8, color: 'var(--text)', marginBottom: 22 }}
             dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f5f0e8">$1</strong>') }} />
        ))}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 30, paddingTop: 22, display: 'flex', gap: 8, fontFamily: "'Outfit', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-dim)' }}>
          Tags: {p.tags.map((t) => <span key={t} style={{ color: 'var(--accent)' }}>#{t}</span>)}
        </div>
      </article>
    </main>
  );
}
