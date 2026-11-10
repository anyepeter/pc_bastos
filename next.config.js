/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Image uploads go through a server action, which takes 1 MB by default.
    // Vercel caps a request at 4.5 MB; the editor shrinks photos before
    // sending, and the action itself refuses files over 4 MB.
    serverActions: { bodySizeLimit: '4.5mb' },
  },
  images: {
    remotePatterns: [
      // The R2 bucket that holds every upload. Same address as
      // MEDIA_BASE_URL in lib/media.ts.
      {
        protocol: 'https',
        hostname: 'pub-f74c0db0e11440b6a7693d42e90d9444.r2.dev',
        port: '',
        pathname: '/**',
      },
      // Uploads lived on Cloudinary until November 2026. Kept so restoring
      // the old URLs stays a database-only rollback.
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // One host for search engines: www serves the same site, so it is
      // folded into the bare domain (the canonical in lib/site.ts).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.cepcacameroun.com' }],
        destination: 'https://cepcacameroun.com/:path*',
        permanent: true,
      },
      // The giving page lives at /give (the nav CTA). Several older components
      // still link to /donate and /donate/recurring, so those are folded in
      // rather than left as 404s — in both languages.
      { source: '/donate', destination: '/give', permanent: false },
      { source: '/donate/:path*', destination: '/give', permanent: false },
      { source: '/fr/donate', destination: '/fr/give', permanent: false },
      { source: '/fr/donate/:path*', destination: '/fr/give', permanent: false },
      // The old "Leadership" menu entry. Links to it may still be out there.
      { source: '/about/leadership', destination: '/about/general-secretariat', permanent: false },
      { source: '/about/departments', destination: '/about/general-secretariat', permanent: false },
      { source: '/fr/about/leadership', destination: '/fr/about/general-secretariat', permanent: false },
      { source: '/fr/about/departments', destination: '/fr/about/general-secretariat', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        // Vercel's own deployment addresses (*.vercel.app) serve the same
        // pages; keep them out of search results. cepcacameroun.com is not
        // matched by this pattern.
        source: '/:path*',
        has: [{ type: 'host', value: '.*\\.vercel\\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ];
  },
};

module.exports = nextConfig;
