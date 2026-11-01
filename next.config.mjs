/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  serverExternalPackages: ['ffmpeg-static', 'fluent-ffmpeg'],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'no-referrer-when-downgrade'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://*.googleadservices.com https://googleads.g.doubleclick.net https://*.googlesyndication.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://stats.g.doubleclick.net https://*.g.doubleclick.net https://*.google.com; img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://*.googleadservices.com https://*.doubleclick.net https://i.ytimg.com https://img.youtube.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://youtube.com https://www.googletagmanager.com https://*.doubleclick.net; object-src 'none'; base-uri 'self'; form-action 'self';"
        }
      ]
    }
  ]
}

export default nextConfig;
