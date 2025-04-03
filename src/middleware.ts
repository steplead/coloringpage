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
    // Parse the Accept-Language header manually since we can't use Negotiator fully
    try {
      languages = acceptLanguage
        .split(',')
        .map(lang => {
          const [code] = lang.trim().split(';');
          return code;
        });
    } catch (e) {
      console.error('Error parsing accept-language header:', e);
      languages = ['en'];
    }
  }

  // Ensure we have at least the default language
  if (!languages.length) {
    languages = ['en'];
  }

  // Match the preferred language against our supported ones
  const supportedLanguageCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);
  
  try {
    return match(languages, supportedLanguageCodes, 'en');
  } catch (e) {
    console.error('Error matching languages:', e);
    return 'en';
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for api routes and static files
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Detect the user's preferred language
  const detectedLanguage = detectLanguage(request);
  
  // Create a response that carries forward the language information
  const response = NextResponse.next();
  
  // Add the detected language to response headers for the application to use
  response.headers.set('x-language', detectedLanguage);
  
  // If there's no language cookie yet, set it to the detected language
  if (!request.cookies.has(LANGUAGE_COOKIE)) {
    response.cookies.set(LANGUAGE_COOKIE, detectedLanguage, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths except for the root URL
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}; 