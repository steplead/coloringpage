import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest, GenerationResponse } from '@/types/image';

// SiliconFlow API configuration
const API_KEY = process.env.SILICONFLOW_API_KEY || 'sk-frjnkxrmiaajoxjziaqgwmyorlermfnpbctcchsvazrlxeah';
const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/images/generations';
const MODEL = process.env.SILICONFLOW_MODEL || 'black-forest-labs/FLUX.1-schnell';

// Basic coloring page style prompt
const BASE_PROMPT = 'black outline coloring page, clean lines';

export async function POST(request: NextRequest) {
  try {
    // Parse request data
    const body = await request.json() as GenerationRequest;
    const { description } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' } as GenerationResponse,
        { status: 400 }
      );
    }

    // Combine base prompt with user description
    const finalPrompt = `${description}, ${BASE_PROMPT}`;

    console.log('Generating image with prompt:', finalPrompt);

    // Call SiliconFlow API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: finalPrompt,
        num_inference_steps: 30,
        guidance_scale: 7.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      return NextResponse.json(
        { 
          error: 'Failed to generate image from API', 
          details: errorData 
        } as GenerationResponse,
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return generation result
    return NextResponse.json({
      success: true,
      prompt: finalPrompt,
      imageUrl: data.data[0].url,
      message: 'Image generated successfully'
    } as GenerationResponse);

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate image', 
        details: error instanceof Error ? error.message : String(error) 
      } as GenerationResponse,
      { status: 500 }
    );
  }
} 