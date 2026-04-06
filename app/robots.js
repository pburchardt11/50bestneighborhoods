const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.50bestneighborhoods.com').replace(/\/$/, '');

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
