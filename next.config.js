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
    // The giving page lives at /give (the nav CTA). Several older components
    // still link to /donate and /donate/recurring, so those are folded in
    // rather than left as 404s.
    return [
      { source: '/donate', destination: '/give', permanent: false },
      { source: '/donate/:path*', destination: '/give', permanent: false },
      // The old "Leadership" menu entry. Links to it may still be out there.
      { source: '/about/leadership', destination: '/about/general-secretariat', permanent: false },
      { source: '/about/departments', destination: '/about/general-secretariat', permanent: false },
    ];
  },
};

module.exports = nextConfig;
