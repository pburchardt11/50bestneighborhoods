export const metadata = {
  title: 'Privacy Policy',
  description: 'How 50 Best Neighborhoods handles your data, cookies, analytics and third-party services.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <main>
      <section style={{ padding: '80px 0 30px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow">Legal</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 400, margin: '14px 0 12px', color: '#f5f0e8' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', fontFamily: "'Outfit', sans-serif", letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Last updated: April 2026
          </p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: 760, padding: '50px 0', fontSize: 17, lineHeight: 1.75, color: 'var(--text)' }}>
        <p>50 Best Neighborhoods (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website at 50bestneighborhoods.com. We take your privacy seriously and have designed this site to collect as little personal data as possible.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>1. What we collect</h2>
        <p><strong style={{ color: '#f5f0e8' }}>Analytics.</strong> We use Vercel Analytics, which is privacy-friendly and does not set tracking cookies. It records anonymized page views, referring URL, browser type and country &mdash; nothing that identifies you personally. Vercel does not share this data with third parties.</p>
        <p><strong style={{ color: '#f5f0e8' }}>Email.</strong> If you contact us by email, we receive your email address and the contents of your message. We use this only to respond to you and we do not add you to any mailing list without explicit consent.</p>
        <p><strong style={{ color: '#f5f0e8' }}>Newsletter.</strong> If you subscribe to our newsletter, we collect your email address through our newsletter provider. You can unsubscribe at any time using the link in any email we send.</p>
        <p><strong style={{ color: '#f5f0e8' }}>Server logs.</strong> Like every web server, ours records IP addresses and request metadata for security and abuse-prevention purposes. These logs are retained for a maximum of 30 days.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>2. Cookies</h2>
        <p>This site does not set any tracking, advertising or fingerprinting cookies. The only cookies we set are functional ones &mdash; for example, remembering your preferred language if you use the translation tool.</p>
        <p>If you choose to translate the site using our floating language toggle, the underlying Google Translate widget may set its own cookies. These are subject to <a style={{ color: 'var(--accent)' }} href="https://policies.google.com/privacy">Google&rsquo;s privacy policy</a>.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>3. Third-party services</h2>
        <p>We display embedded maps from OpenStreetMap and link out to Google Maps for points-of-interest discovery. When you click these links you are subject to the privacy policies of those providers.</p>
        <p>Some links on this site are <strong style={{ color: '#f5f0e8' }}>affiliate links</strong> &mdash; specifically to <a style={{ color: 'var(--accent)' }} href="https://www.getyourguide.com">GetYourGuide</a> and <a style={{ color: 'var(--accent)' }} href="https://www.viator.com">Viator</a> for tours and experiences. If you click an affiliate link and make a purchase, we may earn a small commission at no extra cost to you. These commissions help keep the site running. Affiliate links are clearly marked with the standard <code>rel=&quot;sponsored&quot;</code> attribute.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>4. Your rights (GDPR / CCPA)</h2>
        <p>If you are in the EU, UK or California, you have the right to access, correct or delete any personal data we hold about you. Because we collect almost no personal data, in practice this only applies to email correspondence and newsletter subscriptions. To exercise these rights, email <a style={{ color: 'var(--accent)' }} href="mailto:legal@50bestneighborhoods.com">legal@50bestneighborhoods.com</a>.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>5. Children</h2>
        <p>This site is not directed at children under 13, and we do not knowingly collect personal information from them.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>6. Changes to this policy</h2>
        <p>We may update this privacy policy from time to time. Material changes will be announced at the top of this page and the &ldquo;last updated&rdquo; date will be revised.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>7. Contact</h2>
        <p>Questions about this policy: <a style={{ color: 'var(--accent)' }} href="mailto:legal@50bestneighborhoods.com">legal@50bestneighborhoods.com</a>.</p>
      </article>
    </main>
  );
}
