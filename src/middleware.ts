import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

const locales = SUPPORTED_LANGUAGES.map(lang => lang.code);
const defaultLocale = 'en';

function getLocaleFromRequest(request: NextRequest): string {
  // First check if we have a language cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Get accept-language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferredLocale = acceptLanguage
    .split(',')[0]
    ?.split('-')[0]
    ?.toLowerCase();

  // Check if the preferred locale is supported
  if (preferredLocale && locales.includes(preferredLocale)) {
    return preferredLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check if the path starts with a supported locale
  const pathnameLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // If URL has supported locale, forward as-is
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale);
    return response;
  }

  // Get locale from request
  const locale = getLocaleFromRequest(request);
  
  // Clone the URL and add the locale prefix
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  // Instead of redirecting, rewrite the request
  const response = NextResponse.rewrite(url);
  
  // Set locale cookie
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /favicon.ico (favicon file)
     * 4. all files in the public folder
     */
    '/((?!api/|_next/|favicon.ico|.*\\.).*)',
  ],
}; 