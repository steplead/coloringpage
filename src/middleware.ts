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
  const { pathname, search } = request.nextUrl;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/images/')
  ) {
    return NextResponse.next();
  }

  // Check if the path starts with a supported locale
  const pathnameLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // If URL has supported locale, forward as-is and set cookie
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return response;
  }

  // Get locale from request
  const locale = getLocaleFromRequest(request);
  
  // Create new URL with locale prefix
  const url = new URL(request.url);
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search; // Preserve query parameters

  // Create response with rewrite
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
    // Match all paths except those that start with:
    // - api (API routes)
    // - _next (Next.js internals)
    // - static (static files)
    // - images (static images)
    // - favicon.ico, robots.txt, sitemap.xml (public files)
    '/((?!api/|_next/|static/|images/|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}; 