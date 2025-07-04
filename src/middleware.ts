import { auth } from '@/auth';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n';

// Create the i18n middleware with strict domain handling
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // Don't generate alternate links to prevent domain issues
  alternateLinks: false
});

export default auth(async (req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // CRITICAL: Prevent localhost redirects in any Vercel environment
  const isVercelEnvironment = process.env.VERCEL || process.env.VERCEL_ENV;
  const currentHost = req.headers.get('host');
  
  // Let next-intl handle the locale routing first
  const intlResponse = intlMiddleware(req);
  
  // If intl middleware returns a redirect, ensure it NEVER uses localhost
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    const location = intlResponse.headers.get('location');
    
    if (location) {
      // If it's trying to redirect to localhost, fix it immediately
      if (location.includes('localhost:3000')) {
        const protocol = isVercelEnvironment ? 'https' : 'http';
        const fixedLocation = location.replace('http://localhost:3000', `${protocol}://${currentHost}`);
        return NextResponse.redirect(fixedLocation);
      }
    }
    return intlResponse;
  }
  
  // If intl middleware handled the request successfully, return it
  if (intlResponse) {
    return intlResponse;
  }

  // Extract locale from pathname for auth checks
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Get the pathname without locale for easier checking
  const pathnameWithoutLocale = pathnameHasLocale
    ? pathname.replace(/^\/[^\/]+/, '')
    : pathname;

  // Protect superadmin routes
  if (
    pathnameWithoutLocale.startsWith('/superadmin') ||
    pathnameWithoutLocale.startsWith('/api/superadmin')
  ) {
    if (!req.auth?.user?.isSuperAdmin) {
      const locale = pathnameHasLocale ? pathname.split('/')[1] : defaultLocale;
      const protocol = isVercelEnvironment ? 'https' : (req.headers.get('x-forwarded-proto') || 'http');
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, `${protocol}://${currentHost}`));
    }
  }

  // Check for organizationId in dynamic route segments
  const organizationIdMatch = pathnameWithoutLocale.match(/\/organizations\/([^\/]+)/);
  const organizationId = organizationIdMatch?.[1];

  if (organizationId) {
    // Check if user is authenticated
    if (!req.auth?.user) {
      const locale = pathnameHasLocale ? pathname.split('/')[1] : defaultLocale;
      const protocol = isVercelEnvironment ? 'https' : (req.headers.get('x-forwarded-proto') || 'http');
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, `${protocol}://${currentHost}`));
    }

    return NextResponse.next();
  }

  // Protect profile routes
  if (pathnameWithoutLocale.startsWith('/profile')) {
    if (!req.auth?.user) {
      const locale = pathnameHasLocale ? pathname.split('/')[1] : defaultLocale;
      const protocol = isVercelEnvironment ? 'https' : (req.headers.get('x-forwarded-proto') || 'http');
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, `${protocol}://${currentHost}`));
    }
  }

  return NextResponse.next();
});

// Configure matcher for protected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (will be handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public|api(?!/organizations|/superadmin)).*)',
    '/api/organizations/:organizationId/:path*',
    '/api/superadmin/:path*',
  ],
};
