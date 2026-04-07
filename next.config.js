/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Vercel Blob — primary image source after migration
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      // Wikimedia — fallback for entries not yet migrated
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Legacy fallbacks
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

module.exports = nextConfig;
