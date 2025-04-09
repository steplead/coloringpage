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
    
    if (languages.length === 0) {
      return defaultLocale;
    }
    
    const validLanguages = languages.filter(lang => {
      return typeof lang === 'string' && /^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/.test(lang);
    });
    
    if (validLanguages.length === 0) {
      return defaultLocale;
    }
    
    const detectedLocale = matchLocale(validLanguages, locales, defaultLocale);
    return detectedLocale;
  } catch (error) {
    console.error('Error detecting locale:', error);
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, static files, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Special handling for root path
  if (pathname === '/') {
    const locale = getLocaleFromRequest(request);
    const url = new URL(request.url);
    url.pathname = `/${locale}`;
    
    return NextResponse.redirect(url);
  }

  // Check if the path starts with a locale
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  const hasLocale = locales.includes(firstSegment);

  // If no locale in path, redirect
  if (!hasLocale) {
    const locale = getLocaleFromRequest(request);
    const url = new URL(request.url);
    url.pathname = `/${locale}${pathname}`;
    
    return NextResponse.redirect(url);
  }

  // For paths with valid locale, just add headers and cookies
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  response.headers.set('x-locale', firstSegment);
  
  // Set the locale cookie
  response.cookies.set('NEXT_LOCALE', firstSegment, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 