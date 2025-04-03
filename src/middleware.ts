import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { SUPPORTED_LANGUAGES } from './lib/i18n/locales';

// Cookie name for storing language preference
const LANGUAGE_COOKIE = 'preferred_language';

// Paths that don't need to be processed by the middleware
const PUBLIC_PATHS = [
  '/api/',
  '/_next/',
  '/fonts/',
  '/images/',
  '/favicon.ico',
];

/**
 * Determine if a path should be handled by the middleware
 */
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
}

/**
 * Detect user's preferred language from headers or cookie
 */
function detectLanguage(request: NextRequest): string {
  // Check if there's a cookie with language preference
  const cookieValue = request.cookies.get(LANGUAGE_COOKIE)?.value;
  if (cookieValue && SUPPORTED_LANGUAGES.some(lang => lang.code === cookieValue)) {
    return cookieValue;
  }

  // Use Accept-Language header to determine preferred language
  let languages: string[] = [];
  
  // Get language preferences from the request header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  if (acceptLanguage) {
    // Parse the Accept-Language header (we're using negotiator but in a non-Node environment)
    // Create a mock headers object for Negotiator
    const headers = { 'accept-language': acceptLanguage };
    const negotiatorHeaders = {
      get: (name: string) => (name.toLowerCase() === 'accept-language' ? acceptLanguage : undefined),
    };
    
    const negotiator = new Negotiator({ headers: negotiatorHeaders as any });
    languages = negotiator.languages();
  }

  // Ensure we have at least the default language
  if (!languages.length) {
    languages = ['en'];
  }

  // Match the preferred language against our supported ones
  const supportedLanguageCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);
  
  return match(languages, supportedLanguageCodes, 'en');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for api routes and static files
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Detect the user's preferred language
  const detectedLanguage = detectLanguage(request);
  
  // Create a rewrite URL that includes the language information in the header
  const response = NextResponse.next();
  
  // Add the detected language to response headers for the application to use
  response.headers.set('x-language', detectedLanguage);
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths except for the root URL
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}; 