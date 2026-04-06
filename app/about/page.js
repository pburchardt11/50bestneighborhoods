export const metadata = {
  title: 'About',
  description: 'How 50 Best Neighborhoods works, who we are, and how we choose the world\'s best urban districts.',
  alternates: { canonical: 'https://www.50bestneighborhoods.com/about' },
};

export default function AboutPage() {
  return (
    <main>
      <section style={{ padding: '80px 0 30px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow">About</div>
          <h1 className="serif-display" style={{ fontSize: 'clamp(48px,8vw,104px)', fontWeight: 400, margin: '14px 0 14px', color: '#f5f0e8' }}>
            Why <em style={{ color: '#c9a24b', fontStyle: 'italic' }}>neighborhoods</em>?
          </h1>
          <p style={{ fontSize: 22, color: 'var(--text-dim)', lineHeight: 1.55, fontStyle: 'italic', maxWidth: 720 }}>
            Great cities aren&rsquo;t defined by their skylines or their famous monuments. They&rsquo;re defined by their neighborhoods.
          </p>
        </div>
      </section>

      <article className="container" style={{ maxWidth: 760, padding: '50px 0 20px', fontSize: 19, lineHeight: 1.8, color: 'var(--text)' }}>
        <p>The corner café on a cobblestone street. The market square that fills up on Sundays. The block where the best restaurants happen to cluster. Where you stay changes a city entirely — and the difference between a wonderful weekend and a mediocre one is almost always geographical, not architectural.</p>

        <p>50 Best Neighborhoods is an editorial reference guide to the world&rsquo;s greatest urban districts. We cover more than 150 cities across six continents, with a focus on five flagship neighborhoods per city — chosen to represent the range of what a serious traveler should experience, not just the five most famous ones.</p>

        <h2 className="serif-display" style={{ fontSize: 36, fontWeight: 400, color: '#f5f0e8', margin: '50px 0 18px' }}>How we choose</h2>

        <p>Our rankings are synthesized from trusted travel and local journalism &mdash; Time Out, Cond&eacute; Nast Traveler, The New York Times, The Guardian, Monocle, and the best local press in each city we cover. We read widely, we travel, and we synthesize.</p>

        <p>For factual context about each neighborhood &mdash; history, architecture, demographics, famous residents, cultural landmarks &mdash; we draw on Wikipedia, which is licensed under Creative Commons Attribution-ShareAlike 4.0. That license permits reuse with attribution, which we render on every neighborhood page and in the site footer.</p>

        <p>The result is a deliberate three-layer mix: <strong style={{ color: '#f5f0e8' }}>original editorial rankings</strong>, plus <strong style={{ color: '#f5f0e8' }}>encyclopedic context</strong>, plus <strong style={{ color: '#f5f0e8' }}>attributed links to the best travel journalism</strong>. No scraping, no pasting, no copyright gray area. That is the deal.</p>

        <h2 className="serif-display" style={{ fontSize: 36, fontWeight: 400, color: '#f5f0e8', margin: '50px 0 18px' }}>What we are not</h2>

        <p>We are not a hotel-booking site. We are not a TripAdvisor-style review aggregator. We do not have user-generated content, paid placements, or sponsored rankings. When we link to a hotel or experience provider, those links are clearly marked and they do not influence which neighborhoods we feature or how we rank them.</p>

        <h2 className="serif-display" style={{ fontSize: 36, fontWeight: 400, color: '#f5f0e8', margin: '50px 0 18px' }}>What we believe about travel</h2>

        <p>Three convictions shape this site:</p>

        <p><strong style={{ color: '#f5f0e8' }}>One.</strong> The neighborhood is the irreducible unit of city life. Picking the right one is the single most important decision on any city trip &mdash; more important than the hotel, the restaurant reservations, or the museum schedule.</p>

        <p><strong style={{ color: '#f5f0e8' }}>Two.</strong> Walkability is not a luxury. It is the precondition for everything that makes a city worth visiting. Neighborhoods that work for residents on foot also work for visitors on foot, and they almost always reward slow travel more than the famous tourist sights.</p>

        <p><strong style={{ color: '#f5f0e8' }}>Three.</strong> The best cities are the ones with the most distinctive neighborhoods. Paris is great because Le Marais is not Belleville is not Saint-Germain. Tokyo is great because Shimokitazawa is not Ginza is not Yanaka. A city without strong neighborhoods is just a collection of buildings.</p>

        <h2 className="serif-display" style={{ fontSize: 36, fontWeight: 400, color: '#f5f0e8', margin: '50px 0 18px' }}>The 50 Best family</h2>

        <p>50 Best Neighborhoods is part of the 50 Best family of editorial reference guides &mdash; sister sites cover the world&rsquo;s best bars, hotels, spas, peptides, charms and games. Same editorial DNA, same commitment to original rankings synthesized from the best journalism in each field.</p>

        <h2 className="serif-display" style={{ fontSize: 36, fontWeight: 400, color: '#f5f0e8', margin: '50px 0 18px' }}>Get in touch</h2>

        <p>Editorial tips, neighborhood nominations, corrections, partnership inquiries: <a style={{ color: 'var(--accent)' }} href="mailto:editorial@50bestneighborhoods.com">editorial@50bestneighborhoods.com</a>. We read everything.</p>
      </article>
    </main>
  );
}
