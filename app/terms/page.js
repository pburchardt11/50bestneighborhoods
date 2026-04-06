export const metadata = {
  title: 'Terms of Use',
  description: 'The terms and conditions governing your use of 50 Best Neighborhoods.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/terms' },
};

export default function TermsPage() {
  return (
    <main>
      <section style={{ padding: '80px 0 30px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow">Legal</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 400, margin: '14px 0 12px', color: '#f5f0e8' }}>
            Terms of Use
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-dim)', fontFamily: "'Outfit', sans-serif", letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Last updated: April 2026
          </p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: 760, padding: '50px 0', fontSize: 17, lineHeight: 1.75, color: 'var(--text)' }}>
        <p>Welcome to 50 Best Neighborhoods. By accessing or using this website, you agree to be bound by the following terms. If you do not agree to any of these terms, please do not use this site.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>1. Editorial nature of the content</h2>
        <p>This site is an editorial reference guide to neighborhoods around the world. Our rankings, tags and editorial commentary represent the considered opinion of our editors. Reasonable people may disagree, and no ranking on this site should be treated as an objective fact.</p>
        <p>We make every effort to ensure accuracy, but city life changes constantly &mdash; restaurants close, neighborhoods evolve, prices rise. Always confirm current details (opening hours, addresses, prices, transit) with the venue or operator before traveling.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>2. Intellectual property</h2>
        <p>The original editorial content on this site &mdash; rankings, tags, blog posts, layout, design and our specific selection and arrangement of neighborhoods &mdash; is &copy; 50 Best Neighborhoods and may not be reproduced without written permission.</p>
        <p>Encyclopedic content describing each neighborhood is adapted from Wikipedia and used under the <a style={{ color: 'var(--accent)' }} href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 license</a>. Each neighborhood page links back to its source article. Derivative works of that content must comply with the same license.</p>
        <p>Photographs are sourced from Wikimedia Commons (CC BY-SA, CC BY, or public domain) where possible. If you believe an image on this site infringes your copyright, please contact <a style={{ color: 'var(--accent)' }} href="mailto:legal@50bestneighborhoods.com">legal@50bestneighborhoods.com</a> with full details and we will investigate promptly.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>3. External links</h2>
        <p>This site contains links to third-party websites &mdash; including travel publications, hotels, tour operators and map providers. We do not endorse or control these third-party sites and are not responsible for their content, privacy practices or terms of service.</p>
        <p>Some external links are <strong style={{ color: '#f5f0e8' }}>affiliate links</strong> (currently to GetYourGuide and Viator). Clicking these and making a purchase may result in us earning a commission at no additional cost to you. Affiliate links are marked with the standard <code>rel=&quot;sponsored&quot;</code> attribute and do not influence which neighborhoods we cover or how we rank them.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>4. No travel-advice warranty</h2>
        <p>The information on this site is provided for general interest and trip-planning inspiration only. It is not professional travel advice. We make no representations about safety, accessibility, political conditions or visa requirements in the destinations we cover.</p>
        <p>Always check official government travel advisories before booking international travel. Always purchase travel insurance. Always exercise normal travel safety precautions.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>5. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, 50 Best Neighborhoods, its editors and its operators are not liable for any direct, indirect, incidental, special or consequential damages arising from your use of this site or any decisions you make based on the information it contains.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>6. User submissions</h2>
        <p>If you send us editorial tips, corrections or feedback by email, you grant us a non-exclusive, royalty-free license to use, edit and publish that material on the site, with or without attribution. We will never publish your personal contact details.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>7. Changes</h2>
        <p>We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the new terms.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>8. Governing law</h2>
        <p>These terms are governed by the laws of the European Union and the jurisdiction in which the site operator is established. Any disputes will be subject to the exclusive jurisdiction of the competent courts.</p>

        <h2 className="serif-display" style={{ fontSize: 30, fontWeight: 400, color: '#f5f0e8', margin: '40px 0 14px' }}>9. Contact</h2>
        <p>Questions about these terms: <a style={{ color: 'var(--accent)' }} href="mailto:legal@50bestneighborhoods.com">legal@50bestneighborhoods.com</a>.</p>
      </article>
    </main>
  );
}
