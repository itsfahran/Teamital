const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://app.teamital.com').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async redirects() {
    return [
      // Legacy marketing URLs
      { source: '/security', destination: '/security-policy', permanent: true },
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      { source: '/cookies', destination: '/cookie-policy', permanent: true },
      // Product app (auth + dashboards) lives on the app subdomain
      { source: '/sign-in', destination: `${appUrl}/sign-in`, permanent: false },
      { source: '/sign-up', destination: `${appUrl}/sign-up`, permanent: false },
      { source: '/forgot-password', destination: `${appUrl}/forgot-password`, permanent: false },
      { source: '/reset-password', destination: `${appUrl}/reset-password`, permanent: false },
      { source: '/confirm-signup/:path*', destination: `${appUrl}/confirm-signup/:path*`, permanent: false },
      { source: '/employee/:path*', destination: `${appUrl}/employee/:path*`, permanent: false },
      { source: '/company/:path*', destination: `${appUrl}/company/:path*`, permanent: false },
      { source: '/wl/:path*', destination: `${appUrl}/wl/:path*`, permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }],
      },
    ];
  },
};

export default nextConfig;
