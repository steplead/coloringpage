import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import enTranslations from '@/lib/i18n/translations/en.json';
import zhTranslations from '@/lib/i18n/translations/zh.json';
import esTranslations from '@/lib/i18n/translations/es.json';
import frTranslations from '@/lib/i18n/translations/fr.json';
import deTranslations from '@/lib/i18n/translations/de.json';
import jaTranslations from '@/lib/i18n/translations/ja.json';
import koTranslations from '@/lib/i18n/translations/ko.json';
import ruTranslations from '@/lib/i18n/translations/ru.json';

const translations = {
  en: enTranslations,
  zh: zhTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  ru: ruTranslations,
};

/**
 * Handle GET requests to retrieve translations for a specific language
 * 
 * @param request - The incoming request object
 * @returns A JSON response with translations for the requested language
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  console.log(`GET /api/i18n - Requested language: ${lang}`);

  // Validate language
  if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
    console.error(`GET /api/i18n - Unsupported language: ${lang}`);
    return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
  }

  // Return translations for the requested language, falling back to English if not available
  console.log(`GET /api/i18n - Returning translations for: ${lang}`);
  
  // Check if we have translations for the requested language
  const langTranslations = translations[lang as keyof typeof translations];
  
  // If no translations exist for the requested language, fall back to English
  if (!langTranslations) {
    console.log(`GET /api/i18n - No translations for ${lang}, falling back to English`);
    return NextResponse.json(translations.en);
  }
  
  return NextResponse.json(langTranslations);
}

/**
 * Handle POST requests to set a language preference
 * 
 * @param request - The incoming request object
 * @returns A JSON response indicating success or failure
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lang = body.lang;

    console.log(`POST /api/i18n - Setting language to: ${lang}`);

    // Validate language
    if (!SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
      console.error(`POST /api/i18n - Unsupported language: ${lang}`);
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    // Set language cookie
    const cookieStore = cookies();
    cookieStore.set('NEXT_LOCALE', lang, {
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
    });
  } catch (error) {
    console.error('Error setting language:', error);
    return NextResponse.json({ error: 'Failed to set language' }, { status: 500 });
  }
} 