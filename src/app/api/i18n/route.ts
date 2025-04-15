import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { translations, LANGUAGE_COOKIE } from '@/lib/i18n';

// Enhanced logging with debug info
const logWithDetails = (message: string, details?: unknown) => {
  let detailsString = '';
  if (details !== undefined && details !== null) {
    try {
      detailsString = (typeof details === 'object') ? JSON.stringify(details) : String(details);
    } catch {
      detailsString = '[Unserializable data]';
    }
  }
  const logMessage = detailsString
    ? `${message}: ${detailsString}`
    : message;
  
  console.log(`[i18n API] ${logMessage}`);
};

// Error response helper
const createErrorResponse = (message: string, status: number = 400) => {
  logWithDetails(`Error: ${message}`, { status });
  
  return NextResponse.json(
    { error: message, timestamp: new Date().toISOString() }, 
    { 
      status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
};

/**
 * Handle GET requests to retrieve translations for a specific language
 * 
 * @param request - The incoming request object
 * @returns A JSON response with translations for the requested language
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    // Extract cache buster and force flag
    const cacheBuster = searchParams.get('v');
    const forceRefresh = searchParams.get('force') === 'true';

    logWithDetails(`GET request`, { 
      lang, 
      cacheBuster: cacheBuster || 'none', 
      forceRefresh,
      userAgent: request.headers.get('user-agent')
    });

    // Validate language
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
      return createErrorResponse(`Unsupported language: ${lang}`);
    }

    // Get translations for the requested language
    const langTranslations = translations[lang as keyof typeof translations];
    
    // If no translations exist for the requested language, fall back to English
    if (!langTranslations) {
      logWithDetails(`No translations for ${lang}, falling back to English`);
      
      return NextResponse.json(translations.en, {
        headers: {
          // Prevent caching to ensure updates to translations are received
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }
      });
    }
    
    // Add additional debugging information in development
    const responseData = process.env.NODE_ENV === 'development' 
      ? {
          ...langTranslations,
          _meta: {
            language: lang,
            timestamp: new Date().toISOString(),
            keyCount: Object.keys(langTranslations).length,
          }
        }
      : langTranslations;
    
    logWithDetails(`Returning translations for ${lang}`, { 
      topLevelKeys: Object.keys(langTranslations),
      size: JSON.stringify(langTranslations).length 
    });
    
    return NextResponse.json(responseData, {
      headers: {
        // Prevent caching to ensure updates to translations are received
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`Internal server error: ${errorMessage}`, 500);
  }
}

/**
 * Handle POST requests to set a language preference
 * 
 * @param request - The incoming request object
 * @returns A JSON response indicating success or failure
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lang = body.lang;

    logWithDetails(`POST request to set language`, { lang });

    // Validate language
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
      return createErrorResponse(`Unsupported language: ${lang}`);
    }

    // Set language cookie
    const cookieStore = cookies();
    cookieStore.set(LANGUAGE_COOKIE, lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false, // Allow JavaScript access to see the cookie
    });

    logWithDetails(`Successfully set language cookie to: ${lang}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Language set to ${lang}`,
      cookieSet: true
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error parsing request';
    return createErrorResponse(`Failed to set language: ${errorMessage}`, 500);
  }
}

// Handle OPTIONS requests for CORS preflight
export function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 