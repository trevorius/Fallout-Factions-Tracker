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
  alternateLinks: false,
  // Force proper domain handling in all environments
  domains: undefined
});

export default auth(async (req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // CRITICAL: Prevent localhost redirects in any Vercel environment
  const isVercelEnvironment = process.env.VERCEL || process.env.VERCEL_ENV;
  const currentHost = req.headers.get('host');
  
  // First apply the i18n middleware to handle locale routing
  const intlResponse = intlMiddleware(req);
  
  // If intl middleware returns a redirect, ensure it NEVER uses localhost
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    const location = intlResponse.headers.get('location');
    
    if (location) {
      // If it's trying to redirect to localhost, fix it immediately
      if (location.includes('localhost:3000')) {
        const fixedLocation = location.replace('http://localhost:3000', `https://${currentHost}`);
        return NextResponse.redirect(fixedLocation);
      }
      
      // If it's a relative redirect, preserve the current domain
      if (location.startsWith('/')) {
        const protocol = isVercelEnvironment ? 'https' : (req.headers.get('x-forwarded-proto') || 'http');
        const newUrl = new URL(location, `${protocol}://${currentHost}`);
        return NextResponse.redirect(newUrl);
      }
    }
    return intlResponse;
  }

  // Extract locale from pathname
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
      return Response.redirect(new URL(`/${locale}/unauthorized`, nextUrl));
    }
  }

  // Check for organizationId in dynamic route segments
  const organizationIdMatch = pathnameWithoutLocale.match(/\/organizations\/([^\/]+)/);
  const organizationId = organizationIdMatch?.[1];

  if (organizationId) {
    // Check if user is authenticated
    if (!req.auth?.user) {
      const locale = pathnameHasLocale ? pathname.split('/')[1] : defaultLocale;
      return Response.redirect(new URL(`/${locale}/auth/login`, nextUrl));
    }

    // Instead of checking the database directly in middleware,
    // we'll verify membership in the route handlers
    // This avoids Edge Runtime database limitations
    return NextResponse.next();
  }

  // Protect profile routes
  if (pathnameWithoutLocale.startsWith('/profile')) {
    if (!req.auth?.user) {
      const locale = pathnameHasLocale ? pathname.split('/')[1] : defaultLocale;
      return Response.redirect(new URL(`/${locale}/auth/login`, nextUrl));
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
