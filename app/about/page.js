export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <main className="container" style={{ padding: '80px 0', maxWidth: 780 }}>
      <div className="eyebrow">About</div>
      <h1 className="serif-display" style={{ fontSize: 'clamp(44px,7vw,88px)', fontWeight: 400, margin: '12px 0 24px', color: '#f5f0e8' }}>
        Why 50 Best Neighborhoods?
      </h1>
      <div style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--text)' }}>
        <p>Great cities aren{"'"}t defined by their skylines or their famous monuments — they{"'"}re defined by their neighborhoods. The corner café on a cobblestone street, the market square that fills up on Sundays, the block where the best restaurants happen to cluster. Where you stay changes a city entirely.</p>
        <p>50 Best Neighborhoods is an editorial reference guide to the world{"'"}s greatest urban districts. Our rankings are synthesized from trusted travel journalism — Time Out, Condé Nast Traveler, The New York Times, The Guardian — and the best local publications in each city.</p>
        <p>We cover the world{"'"}s most interesting cities, with a focus on one flagship neighborhood per entry in our Top 50, plus full city guides with five neighborhoods each. We{"'"}re expanding coverage every week.</p>
        <p style={{ color: 'var(--text-dim)' }}>Part of the 50 Best family of editorial guides.</p>
      </div>
    </main>
  );
}
