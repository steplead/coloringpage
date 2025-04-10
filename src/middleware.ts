import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

const locales = SUPPORTED_LANGUAGES.map(lang => lang.code);
const defaultLocale = 'en';

function getLocaleFromPath(pathname: string): string | undefined {
  // Check if the path starts with a locale
  const segments = pathname.split('/');
  const locale = segments[1]; // The locale should be the first segment after '/'
  
  if (locales.includes(locale)) {
    return locale;
  }
  
  return undefined;
}

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
    // Make sure we have a valid Accept-Language header
    const languages = negotiator.languages().filter(Boolean);
    
    if (languages.length === 0) {
      return defaultLocale;
    }
    
    // Filter out any invalid language tags before passing to matchLocale
    const validLanguages = languages.filter(lang => {
      // Basic validation: language tags should follow the pattern xx or xx-XX
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

function getPathWithoutLocale(pathname: string, locale: string): string {
  if (pathname === '/') return '/';
  
  const segments = pathname.split('/');
  if (segments.length > 1 && segments[1] === locale) {
    // Remove the locale segment
    segments.splice(1, 1);
    return segments.join('/') || '/';
  }
  
  return pathname;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, admin routes, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }
  
  // Get locale from the path or from the request
  const pathnameLocale = getLocaleFromPath(pathname);
  const requestLocale = getLocaleFromRequest(request);
  
  // Determine which locale to use
  const finalLocale = pathnameLocale || requestLocale;
  
  // Always redirect if there's no locale in the path
  // This ensures that "/" and any path without locale gets redirected
  if (!pathnameLocale) {
    // Get the path without locale
    const pathWithoutLocale = pathname;
    
    // Add the final locale to create the localized URL
    const segments = pathWithoutLocale.split('/');
    segments.splice(1, 0, finalLocale); // Insert locale after the first '/'
    const newPathname = segments.join('/');
    
    // Create the URL with the new pathname and preserve search params
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    
    // Redirect to the localized URL
    const redirectResponse = NextResponse.redirect(url);
    
    // Set the locale cookie
    redirectResponse.cookies.set('NEXT_LOCALE', finalLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    
    // Also add the pathname header to the redirect response
    redirectResponse.headers.set('x-pathname', newPathname);
    redirectResponse.headers.set('x-locale', finalLocale);
    
    return redirectResponse;
  }
  
  // If path already has a correct locale, just proceed
  if (pathnameLocale === finalLocale) {
    const response = NextResponse.next();
    
    // Add pathname header for the root layout to use
    response.headers.set('x-pathname', pathname);
    response.headers.set('x-locale', finalLocale);
    
    response.cookies.set('NEXT_LOCALE', finalLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    });
    return response;
  }
  
  // Handle the case when path has a different locale than the one we want to use
  // Get the path without locale
  const pathWithoutLocale = getPathWithoutLocale(pathname, pathnameLocale);
  
  // Add the final locale to create the localized URL
  const segments = pathWithoutLocale.split('/');
  segments.splice(1, 0, finalLocale); // Insert locale after the first '/'
  const newPathname = segments.join('/');
  
  // Create the URL with the new pathname and preserve search params
  const url = request.nextUrl.clone();
  url.pathname = newPathname;
  
  // Redirect to the localized URL
  const redirectResponse = NextResponse.redirect(url);
  
  // Set the locale cookie
  redirectResponse.cookies.set('NEXT_LOCALE', finalLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
  
  // Also add the pathname header to the redirect response
  redirectResponse.headers.set('x-pathname', newPathname);
  redirectResponse.headers.set('x-locale', finalLocale);
  
  return redirectResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|admin).*)'],
}; 