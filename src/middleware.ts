import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

const locales = SUPPORTED_LANGUAGES.map(lang => lang.code);
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
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
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    const detectedLocale = matchLocale(languages, locales, defaultLocale);
    return detectedLocale;
  } catch (error) {
    console.error('Error detecting locale:', error);
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Skip middleware for API routes to avoid interference with language switching
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  const locale = getLocale(request);
  
  // Create response
  const response = NextResponse.next();
  
  // Set the locale in response headers for the application to use
  response.headers.set('x-locale', locale);
  
  // Set or update the cookie only if it doesn't exist
  if (!request.cookies.has('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 