/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // 🛡️ OBFUSCATION: Disable source maps to hide logic (Hacker Defense)
  poweredByHeader: false, // 🛡️ Hide "X-Powered-By: Next.js"
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


