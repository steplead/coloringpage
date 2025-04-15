import { NextRequest, NextResponse } from 'next/server';

// Google Gemini API configuration from environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
const MODEL = process.env.GEMINI_MODEL || 'gemini-pro';

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
        { error: 'Server configuration error: Missing API key' },
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

    console.log('Generating text with Gemini API:', { 
      model: MODEL,
      promptPreview: prompt.substring(0, 50) + '...',
      temperature,
      maxTokens
    });

    // Create API request data - format has changed in the v1 API
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
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Call Gemini API
    const apiUrl = `${API_URL}?key=${API_KEY}`;
    console.log(`Calling Gemini API at ${API_URL.split('?')[0]}`);
    
    const response = await fetch(apiUrl, {
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
        { 
          error: `Failed to generate text from Gemini API (Status: ${response.status})`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Received Gemini API response data structure:', JSON.stringify(data).substring(0, 100) + '...');

    // Extract text from response - the structure is different in the v1 API
    let generatedText = '';
    if (data.candidates && 
        data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      generatedText = data.candidates[0].content.parts[0].text;
      console.log('Successfully extracted generated text of length:', generatedText.length);
    } else {
      console.error('Unexpected API response structure:', JSON.stringify(data).substring(0, 200));
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

  } catch (error: unknown) {
    console.error('Error generating text with Gemini:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate text', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 