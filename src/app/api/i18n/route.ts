import { NextRequest, NextResponse } from 'next/server';
import { setLanguage, getTranslations, getTranslation, LANGUAGE_COOKIE } from '@/lib/i18n';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

/**
 * API route to handle language switching and retrieval
 * 
 * GET /api/i18n?lang=en - Returns all translations for a specific language
 * POST /api/i18n { lang: "en" } - Sets the language cookie and returns all translations
 */
export async function GET(request: NextRequest) {
  try {
    // Get the language from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';
    
    // Validate language code
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
      return NextResponse.json({ 
        error: 'Unsupported language code' 
      }, { status: 400 });
    }
    
    // Return translations for the requested language
    const translations = getTranslations(lang);
    
    return NextResponse.json({
      lang,
      translations,
      languageName: getTranslation(lang, 'common.languageName'),
    });
  } catch (error) {
    console.error('Error handling i18n GET request:', error);
    return NextResponse.json({ 
      error: 'Failed to get translations' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the language from the request body
    const body = await request.json();
    
    if (!body.lang) {
      return NextResponse.json({ 
        error: 'Missing language code' 
      }, { status: 400 });
    }
    
    const lang = body.lang;
    
    // Validate language code
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
      return NextResponse.json({ 
        error: 'Unsupported language code' 
      }, { status: 400 });
    }
    
    // Set the language cookie
    setLanguage(lang);
    
    // Return translations for the new language
    const translations = getTranslations(lang);
    
    return NextResponse.json({
      success: true,
      lang,
      translations,
      languageName: getTranslation(lang, 'common.languageName'),
      message: getTranslation(lang, 'common.languageChanged', 'Language changed successfully')
    });
  } catch (error) {
    console.error('Error handling i18n POST request:', error);
    return NextResponse.json({ 
      error: 'Failed to set language' 
    }, { status: 500 });
  }
} 