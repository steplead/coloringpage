import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supportedLanguages, LanguageCode } from '@/lib/i18n';

// Middleware to handle language detection
export function middleware(request: NextRequest) {
  // Skip for static files, API routes, and other non-page routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('.') // Files like favicon.ico, etc.
  ) {
    return NextResponse.next();
  }
  
  // Try to get language preference from cookie or header
  const cookieLang = request.cookies.get('userLanguage')?.value;
  const acceptLang = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  
  // Determine appropriate language
  let detectedLang: LanguageCode = 'en'; // Default
  
  // Check cookie first
  if (cookieLang && cookieLang in supportedLanguages) {
    detectedLang = cookieLang as LanguageCode;
  } 
  // Then accept-language header
  else if (acceptLang && acceptLang in supportedLanguages) {
    detectedLang = acceptLang as LanguageCode;
  }
  
  // Clone the response and update headers
  const response = NextResponse.next();
  
  // Set cookie if not already set
  if (!cookieLang) {
    response.cookies.set('userLanguage', detectedLang);
  }
  
  // Pass the detected language to the app
  response.headers.set('x-lang', detectedLang);
  
  return response;
}

// Only run middleware on specified paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes and _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 