import { NextResponse } from 'next/server';

/**
 * Direct test endpoint for Gemini API
 * Bypasses all other code to test the API directly
 */
export async function GET() {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }
    
    // Simple request to test basic API connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Write a single sentence response."
            }]
          }]
        }),
        signal: controller.signal // Add AbortController signal
      }
    );
    
    clearTimeout(timeoutId); // Clear timeout if fetch completes
    
    // Log everything for debugging
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json({
        status: response.status,
        statusText: response.statusText,
        error: errorText
      }, { status: 500 });
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error: unknown) {
    console.error('Error testing Gemini API directly:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 