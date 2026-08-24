/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
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
    ];
  },
};

module.exports = nextConfig;
