import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cookie name for storing language preference
const LANGUAGE_COOKIE = 'preferred_language';

/**
 * Handle GET requests to retrieve translations for a specific language
 * 
 * @param request - The incoming request object
 * @returns A JSON response with translations for the requested language
 */
export async function GET(request: NextRequest) {
  try {
    // Get the requested language from the URL query parameters
    const { searchParams } = new URL(request.url);
    const requestedLang = searchParams.get('lang') || 'en';
    
    // Path to the translations directory
    const translationsDir = path.join(process.cwd(), 'src', 'lib', 'i18n', 'translations');
    
    // Try to load the requested language file
    let translations;
    try {
      const filePath = path.join(translationsDir, `${requestedLang}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      translations = JSON.parse(fileContent);
    } catch (err) {
      // If the requested language file doesn't exist, fall back to English
      console.error(`Failed to load translations for ${requestedLang}, falling back to English`, err);
      const fallbackPath = path.join(translationsDir, 'en.json');
      const fallbackContent = fs.readFileSync(fallbackPath, 'utf8');
      translations = JSON.parse(fallbackContent);
    }
    
    // Return the translations as JSON
    return NextResponse.json({ 
      success: true, 
      language: requestedLang,
      translations 
    });
  } catch (error) {
    console.error('Error in i18n API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load translations' 
      }, 
      { status: 500 }
    );
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
    // Parse the request body to get the language preference
    const body = await request.json();
    const lang = body.lang || 'en';
    
    // Create a response
    const response = NextResponse.json({ 
      success: true, 
      message: `Language set to ${lang}` 
    });
    
    // Set a cookie with the language preference
    response.cookies.set(LANGUAGE_COOKIE, lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow JavaScript access
    });
    
    return response;
  } catch (error) {
    console.error('Error setting language preference:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to set language preference' 
      }, 
      { status: 500 }
    );
  }
} 