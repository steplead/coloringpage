import { NextRequest, NextResponse } from 'next/server';

// Google Gemini API configuration from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/**
 * Gemini API endpoint to generate text content based on prompts
 * 
 * @param request The incoming request with prompt data
 * @returns Generated text response
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key is available
    if (!API_KEY) {
      console.error('Missing Gemini API key in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse request data
    const body = await request.json();
    const { prompt, temperature = 0.7, maxTokens = 2048 } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating text with Gemini API:', { prompt: prompt.substring(0, 50) + '...' });

    // Create API request data
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: maxTokens
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
      
      return NextResponse.json(
        { error: `Failed to generate text from Gemini API (Status: ${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from response
    let generatedText = '';
    if (data.candidates && 
        data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      generatedText = data.candidates[0].content.parts[0].text;
    } else {
      return NextResponse.json(
        { error: 'API response missing generated text' },
        { status: 500 }
      );
    }

    // Return generation result
    return NextResponse.json({
      success: true,
      text: generatedText
    });

  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
} 