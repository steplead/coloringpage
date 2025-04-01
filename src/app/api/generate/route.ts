import { NextRequest, NextResponse } from 'next/server';

// SiliconFlow API configuration from environment variables
const API_KEY = process.env.SILICONFLOW_API_KEY;
const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/images/generations';
const MODEL = process.env.SILICONFLOW_MODEL || 'black-forest-labs/FLUX.1-schnell';

// Basic coloring page style prompt
const BASE_PROMPT = 'black outline coloring page, clean lines';

// Style modifiers based on complexity
const COMPLEXITY_MODIFIERS = {
  simple: 'few details, large areas to color, simple shapes',
  medium: 'balanced details, moderate complexity',
  complex: 'intricate details, fine lines, more elaborate'
};

// Style modifiers
const STYLE_MODIFIERS = {
  standard: '',
  cute: 'cute, kawaii style',
  cartoon: 'cartoon style, animated',
  realistic: 'realistic style',
  geometric: 'geometric shapes, patterns',
  sketch: 'hand-drawn sketch style'
};

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

      // Get the complexity and style modifiers
      const complexityModifier = COMPLEXITY_MODIFIERS[complexity as keyof typeof COMPLEXITY_MODIFIERS] || '';
      const styleModifier = STYLE_MODIFIERS[style as keyof typeof STYLE_MODIFIERS] || '';
      
      // Build the final prompt with intelligent ordering and spacing
      finalPrompt = description;
      
      // Add style modifier if selected
      if (styleModifier) {
        finalPrompt += `, ${styleModifier}`;
      }
      
      // Add complexity modifier
      if (complexityModifier) {
        finalPrompt += `, ${complexityModifier}`;
      }
      
      // Always add the base prompt to ensure it's a proper coloring page
      finalPrompt += `, ${BASE_PROMPT}`;
    }
    
    console.log('Generating image with prompt:', finalPrompt);

    // Create API request data
    const requestData = {
      model: MODEL,
      prompt: finalPrompt,
      num_inference_steps: complexity === 'complex' ? 40 : 30, // More steps for complex images
      guidance_scale: 7.5
    };

    // Call SiliconFlow API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
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

    // Return generation result
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: finalPrompt
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 