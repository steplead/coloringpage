import { NextRequest, NextResponse } from 'next/server';

// SiliconFlow API configuration from environment variables
const API_KEY = process.env.SILICONFLOW_API_KEY;
const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/images/generations';
const MODEL = process.env.SILICONFLOW_MODEL || 'black-forest-labs/FLUX.1-schnell';

// Style prompts
const STYLE_PROMPTS = {
  classic: 'black outline coloring page, clean lines, minimal detail',
  detailed: 'black outline coloring page with intricate patterns, detailed textures, fine lines',
  simple: 'very simple black outline coloring page, bold thick lines, minimal details, suitable for young children',
  cartoon: 'cartoon style black outline coloring page, cute, whimsical, fun character design',
  realistic: 'realistic black outline coloring page, accurate proportions, anatomical details, clean lines'
};

// Complexity modifiers
const COMPLEXITY_MODIFIERS = {
  simple: { 
    steps: 25,
    guidance: 7.0,
    suffix: ', simplified, fewer details, bolder lines'
  },
  medium: { 
    steps: 30,
    guidance: 7.5,
    suffix: ''
  },
  complex: { 
    steps: 35,
    guidance: 8.0,
    suffix: ', intricate details, fine linework'
  }
};

// Default style and complexity
const DEFAULT_STYLE = 'classic';
const DEFAULT_COMPLEXITY = 'medium';

export async function POST(request: NextRequest) {
  try {
    // Verify API key is available
    if (!API_KEY) {
      console.error('Missing API key in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse request data
    const body = await request.json();
    const { 
      description, 
      style = DEFAULT_STYLE, 
      complexity = DEFAULT_COMPLEXITY 
    } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Get the style prompt
    const stylePrompt = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS] || STYLE_PROMPTS[DEFAULT_STYLE];
    
    // Get complexity settings
    const complexitySettings = COMPLEXITY_MODIFIERS[complexity as keyof typeof COMPLEXITY_MODIFIERS] || 
                              COMPLEXITY_MODIFIERS[DEFAULT_COMPLEXITY];
    
    // Combine description with style and complexity
    const finalPrompt = `${description}, ${stylePrompt}${complexitySettings.suffix}`;
    
    console.log('Generating image with prompt:', finalPrompt);
    console.log('Style:', style);
    console.log('Complexity:', complexity);

    // Create API request data with complexity settings
    const requestData = {
      model: MODEL,
      prompt: finalPrompt,
      num_inference_steps: complexitySettings.steps,
      guidance_scale: complexitySettings.guidance
    };

    // Call SiliconFlow API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'AI-ColoringPage-Generator/1.0'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error status:', response.status);
      console.error('API error response:', errorText);
      
      return NextResponse.json(
        { error: `Failed to generate image from API (Status: ${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check for image URL in the response
    let imageUrl = null;
    if (data.images && data.images.length > 0 && data.images[0].url) {
      imageUrl = data.images[0].url;
    } else if (data.data && data.data.length > 0 && data.data[0].url) {
      imageUrl = data.data[0].url;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'API response missing image URL' },
        { status: 500 }
      );
    }

    // Return generation result with metadata
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      metadata: {
        style,
        complexity,
        prompt: finalPrompt
      }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 