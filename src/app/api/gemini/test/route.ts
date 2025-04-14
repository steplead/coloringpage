import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint for the Gemini API
 * This endpoint sends a simple prompt to verify the API connection is working
 */
export async function GET(request: NextRequest) {
  try {
    // Gemini API configuration
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = process.env.GEMINI_API_URL;
    
    if (!API_KEY || !API_URL) {
      return NextResponse.json(
        { error: 'Missing Gemini API key or URL in environment variables' },
        { status: 500 }
      );
    }
    
    console.log('Testing Gemini API connection with URL:', API_URL);
    
    // Create a simple API request
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: "Hello, please respond with a simple 'Hello, your Gemini API is working!' response."
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };
    
    // Fetch from the Gemini API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify(requestData),
    });
    
    // Parse the response
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      return NextResponse.json(
        { 
          error: `Gemini API request failed with status ${response.status}`, 
          details: errorText,
          apiUrl: API_URL
        },
        { status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('Gemini API test response:', JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Gemini API test successful',
      response: data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No text in response',
      apiUrl: API_URL
    });
  } catch (error: any) {
    console.error('Exception testing Gemini API:', error);
    return NextResponse.json(
      { 
        error: 'Exception testing Gemini API',
        message: error.message, 
        stack: error.stack,
        apiUrl: process.env.GEMINI_API_URL
      },
      { status: 500 }
    );
  }
} 