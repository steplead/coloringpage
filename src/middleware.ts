import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

const locales = SUPPORTED_LANGUAGES.map(lang => lang.code);
const defaultLocale = 'en';

function getLocaleFromRequest(request: NextRequest): string {
  // First check if we have a language cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // If no cookie, detect from browser preferences
  let negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  try {
    const negotiator = new Negotiator({ headers: negotiatorHeaders });
    const languages = negotiator.languages().filter(Boolean);
    return languages[0]?.split('-')[0] || defaultLocale;
  } catch (error) {
    console.error('Error detecting locale:', error);
    return defaultLocale;
  }
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
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to the same path with locale
  const locale = getLocaleFromRequest(request);
  const redirectPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  
  // Create redirect response
  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  
  // Set cookie
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return response;
}

// Specify which paths should be handled by this middleware
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api/|_next/|favicon.ico).*)',
  ],
}; 