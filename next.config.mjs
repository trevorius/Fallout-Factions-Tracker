import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper URL handling across all environments
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Prevent any localhost redirects in Vercel environments
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Prevent localhost caching issues
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
  
  // Override any problematic redirects
  async redirects() {
    return [];
  },
  
  // Ensure proper base path handling
  trailingSlash: false,
  
  // Force HTTPS in Vercel environments
  ...(process.env.VERCEL && {
    assetPrefix: undefined,
  }),
};

export default withNextIntl(nextConfig);
