import { NextRequest, NextResponse } from 'next/server';

// SiliconFlow API configuration from environment variables
const API_KEY = process.env.SILICONFLOW_API_KEY || 'sk-frjnkxrmiaajoxjziaqgwmyorlermfnpbctcchsvazrlxeah'; // Fallback to default key if not set
const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/images/generations';
const MODEL = process.env.SILICONFLOW_MODEL || 'black-forest-labs/FLUX.1-schnell';

// Basic coloring page style prompt
const BASE_PROMPT = 'black outline coloring page, clean lines';

// Style modifiers based on complexity
const COMPLEXITY_MODIFIERS = {
  simple: 'simple, few details, large areas to color',
  medium: 'balanced details',
  complex: 'intricate details, fine lines'
};

// Style modifiers
const STYLE_MODIFIERS = {
  standard: '',
  cute: 'cute style',
  cartoon: 'cartoon style',
  realistic: 'realistic style',
  geometric: 'geometric patterns',
  sketch: 'sketch style'
};

export async function POST(request: NextRequest) {
  try {
    // Parse request data
    const body = await request.json();
    const { 
      description, 
      complexity = 'medium',
      style = 'standard',
      advancedMode = false,
      customPrompt = '' 
    } = body;

    // In advanced mode, use the custom prompt directly
    // Otherwise, construct prompt with modifiers
    let finalPrompt;
    
    if (advancedMode && customPrompt) {
      // Use custom prompt directly without adding base prompt
      finalPrompt = customPrompt;
      console.log('Using advanced mode with custom prompt:', finalPrompt);
    } else {
      // Require description in standard mode
      if (!description) {
        return NextResponse.json(
          { error: 'Description is required' },
          { status: 400 }
        );
      }

      // Simplify prompt construction to reduce errors
      finalPrompt = description;
      
      // Add style modifier if selected and not standard
      if (style !== 'standard' && STYLE_MODIFIERS[style as keyof typeof STYLE_MODIFIERS]) {
        finalPrompt += `, ${STYLE_MODIFIERS[style as keyof typeof STYLE_MODIFIERS]}`;
      }
      
      // Add complexity modifier if not medium (the default)
      if (complexity !== 'medium' && COMPLEXITY_MODIFIERS[complexity as keyof typeof COMPLEXITY_MODIFIERS]) {
        finalPrompt += `, ${COMPLEXITY_MODIFIERS[complexity as keyof typeof COMPLEXITY_MODIFIERS]}`;
      }
      
      // Always add the base prompt to ensure it's a proper coloring page
      finalPrompt += `, ${BASE_PROMPT}`;
    }
    
    // Ensure the prompt isn't too long (SiliconFlow has limits)
    if (finalPrompt.length > 500) {
      finalPrompt = finalPrompt.substring(0, 497) + '...';
    }
    
    console.log('Generating image with prompt:', finalPrompt);

    // Create API request data - keeping it as simple as possible
    const requestData = {
      model: MODEL,
      prompt: finalPrompt,
      num_inference_steps: 30,
      guidance_scale: 7.5
    };

    // Call SiliconFlow API with better error handling
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    // Handle error responses with detailed logging
    if (!response.ok) {
      let errorMessage = `API error (Status: ${response.status})`;
      let errorData = null;
      
      try {
        // Try to parse error response as JSON
        errorData = await response.json();
        console.error('API error details:', errorData);
        
        if (errorData.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if (errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        }
      } catch (e) {
        // If not JSON, try as text
        try {
          const errorText = await response.text();
          console.error('API error text:', errorText);
          errorMessage += `: ${errorText}`;
        } catch (textError) {
          console.error('Could not parse error response');
        }
      }
      
      // Check for common error cases
      if (response.status === 401 || response.status === 403) {
        errorMessage = "Authentication error with the image API. Please check your API key.";
      } else if (response.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // Parse successful response
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Error parsing API response:', error);
      return NextResponse.json(
        { error: 'Failed to parse API response' },
        { status: 500 }
      );
    }

    // Check for image URL in the response
    let imageUrl = null;
    if (data.images && data.images.length > 0 && data.images[0].url) {
      imageUrl = data.images[0].url;
    } else if (data.data && data.data.length > 0 && data.data[0].url) {
      imageUrl = data.data[0].url;
    }

    if (!imageUrl) {
      console.error('Missing image URL in response:', data);
      return NextResponse.json(
        { error: 'API response missing image URL' },
        { status: 500 }
      );
    }

    // Return generation result
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: finalPrompt
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again with a different description.' },
      { status: 500 }
    );
  }
} 