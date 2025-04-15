import { NextResponse } from 'next/server';

// Simple test endpoint for Gemini API
export async function GET() {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    if (!API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 500 });
    }
    
    console.log('Testing Gemini API with key:', API_KEY.substring(0, 5) + '...');
    
    // Simple test request
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: "Hello, please reply with 'Gemini API is working correctly!'"
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 100
      }
    };
    
    // Call Gemini API
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error status:', response.status);
      console.error('Gemini API error response:', errorText);
      
      return NextResponse.json({
        success: false,
        error: `Failed to connect to Gemini API (Status: ${response.status})`,
        details: errorText
      });
    }
    
    const data = await response.json();
    let generatedText = 'No text generated';
    
    if (data.candidates && 
        data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      generatedText = data.candidates[0].content.parts[0].text;
    }
    
    return NextResponse.json({
      success: true,
      text: generatedText,
      apiKeyConfigured: !!API_KEY,
      apiUrlConfigured: !!API_URL
    });
  } catch (error: unknown) {
    console.error('Error testing Gemini API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test Gemini API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 