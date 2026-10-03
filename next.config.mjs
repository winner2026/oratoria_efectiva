/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // 🛡️ OBFUSCATION: Disable source maps to hide logic
  poweredByHeader: false, // 🛡️ Hide "X-Powered-By: Next.js"
  
  // 🔀 Rewrites: /vocalgym/:path* → /:path* (app lives under /vocalgym without moving files)
  async rewrites() {
    return [
      {
        source: '/vocalgym/:path*',
        destination: '/:path*',
      },
    ];
  },

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
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com; img-src 'self' data: https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://www.youtube.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self';"
        }
      ]
    }
  ]
}

export default nextConfig



