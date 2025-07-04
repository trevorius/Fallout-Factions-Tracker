import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Vercel toolbar in production
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Ensure proper URL handling
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
  
  // Handle redirects properly
  async redirects() {
    return [];
  },
};

export default withNextIntl(nextConfig);
