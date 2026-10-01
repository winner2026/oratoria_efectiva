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
        }
      ]
    }
  ]
}

export default nextConfig



