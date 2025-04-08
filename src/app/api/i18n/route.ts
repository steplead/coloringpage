import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import { translations, LANGUAGE_COOKIE } from '@/lib/i18n';

/**
 * Handle GET requests to retrieve translations for a specific language
 * 
 * @param request - The incoming request object
 * @returns A JSON response with translations for the requested language
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  console.log(`GET /api/i18n - Requested language: ${lang}`);

  // Validate language
  if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
    console.error(`GET /api/i18n - Unsupported language: ${lang}`);
    return NextResponse.json({ error: 'Unsupported language' }, { 
      status: 400,
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  // Return translations for the requested language, falling back to English if not available
  console.log(`GET /api/i18n - Returning translations for: ${lang}`);
  
  // Check if we have translations for the requested language
  const langTranslations = translations[lang as keyof typeof translations];
  
  // If no translations exist for the requested language, fall back to English
  if (!langTranslations) {
    console.log(`GET /api/i18n - No translations for ${lang}, falling back to English`);
    return NextResponse.json(translations.en, {
      headers: {
        // Cache translations for a day
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
  
  return NextResponse.json(langTranslations, {
    headers: {
      // Cache translations for a day
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    }
  });
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

    console.log(`POST /api/i18n - Setting language to: ${lang}`);

    // Validate language
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
      console.error(`POST /api/i18n - Unsupported language: ${lang}`);
      return NextResponse.json({ error: 'Unsupported language' }, { 
        status: 400,
        headers: {
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Set language cookie
    const cookieStore = cookies();
    cookieStore.set(LANGUAGE_COOKIE, lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false, // Allow JavaScript access to see the cookie
    });

    console.log(`POST /api/i18n - Successfully set language cookie to: ${lang}`);
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
    console.error('Error setting language:', error);
    return NextResponse.json({ error: 'Failed to set language' }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      }
    });
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