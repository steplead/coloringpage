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

  // Check if the path starts with a locale
  const pathnameSegments = pathname.split('/');
  const firstSegment = pathnameSegments[1];
  const hasLocale = locales.includes(firstSegment);

  // If the path already has a valid locale, proceed
  if (hasLocale) {
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    response.headers.set('x-locale', firstSegment);
    return response;
  }

  // If no locale in path, redirect to the appropriate locale version
  const locale = getLocaleFromRequest(request);
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
  );
  
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 