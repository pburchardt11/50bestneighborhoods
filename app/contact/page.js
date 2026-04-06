export const metadata = {
  title: 'Contact',
  description: 'Editorial tips, neighborhood nominations, corrections and partnership inquiries.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/contact' },
};

export default function ContactPage() {
  return (
    <main>
      <section style={{ padding: '80px 0 30px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow">Contact</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px,8vw,104px)', fontWeight: 400, margin: '14px 0 14px', color: '#f5f0e8' }}>
            Get in <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>touch</em>
          </h1>
          <p style={{ fontSize: 20, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 720 }}>
            We read everything. Tell us about a neighborhood we&rsquo;ve missed, an inaccuracy we need to fix, or a city that deserves a guide.
          </p>
        </div>
      </section>

      <section className="container" style={{ maxWidth: 900, padding: '50px 0' }}>
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          <ContactCard
            eyebrow="Editorial"
            title="Tips, corrections, additions"
            email="editorial@50bestneighborhoods.com"
            note="Have we mis-ranked your city? Did we miss the best bar in Belleville? Send us a one-paragraph case &mdash; we update."
          />
          <ContactCard
            eyebrow="Press"
            title="Quotes, syndication, interviews"
            email="press@50bestneighborhoods.com"
            note="Journalists writing about urban life, travel or 50 Best can reach the editorial team here."
          />
          <ContactCard
            eyebrow="Partnerships"
            title="Hotels, tourism boards, brands"
            email="partnerships@50bestneighborhoods.com"
            note="We accept a small number of partnerships per quarter. All paid relationships are clearly disclosed and do not influence rankings."
          />
          <ContactCard
            eyebrow="Legal & DMCA"
            title="Takedown notices and rights"
            email="legal@50bestneighborhoods.com"
            note="If you believe content on this site infringes a copyright you own, please send a complete DMCA notice including the URL of the disputed material."
          />
        </div>

        <div style={{ marginTop: 50, padding: 28, border: '1px solid var(--border)', borderRadius: 2, background: 'rgba(201,162,75,0.04)' }}>
          <div className="eyebrow">Response time</div>
          <p style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.7, marginBottom: 0 }}>
            We are a small editorial team and we read every message ourselves. Expect a response within <strong style={{ color: '#f5f0e8' }}>3&ndash;7 business days</strong>. Editorial corrections are usually applied immediately upon verification.
          </p>
        </div>
      </section>
    </main>
  );
}

function ContactCard({ eyebrow, title, email, note }) {
  return (
    <a
      href={`mailto:${email}`}
      className="card"
      style={{ display: 'block', padding: 24 }}
    >
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="serif-display" style={{ fontSize: 22, fontWeight: 400, color: '#f5f0e8', margin: '8px 0 10px' }}>{title}</h2>
      <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 14 }}>{note}</p>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'var(--accent)', letterSpacing: 1, wordBreak: 'break-all' }}>{email} →</div>
    </a>
  );
}
