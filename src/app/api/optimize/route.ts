import { NextRequest, NextResponse } from 'next/server';
import { optimizeColoring, optimizeForAgeGroup } from '@/lib/imageOptimization';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, options } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // Fetch the image data
    let imageData;
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the image');
      }
      // Get image as base64 string
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = response.headers.get('content-type') || 'image/png';
      imageData = `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('Error fetching image:', error);
      return NextResponse.json(
        { error: 'Failed to fetch the image' },
        { status: 500 }
      );
    }
    
    // Apply optimization
    const optimizationResult = optimizeColoring(imageData, options || {});
    
    // Apply age-specific optimizations if age group is specified
    if (options?.targetAge) {
      optimizationResult.imageData = optimizeForAgeGroup(optimizationResult.imageData, options.targetAge);
      optimizationResult.optimizationApplied.push(`Age-specific optimization for ${options.targetAge}`);
    }
    
    return NextResponse.json({
      optimizedImageData: optimizationResult.imageData,
      metrics: optimizationResult.metrics,
      optimizationApplied: optimizationResult.optimizationApplied
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 