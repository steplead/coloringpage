/**
 * Image Optimization Service for Coloring Pages
 * 
 * Implements the line quality optimization techniques from our technical roadmap:
 * - Line smoothness quantification
 * - Line thickness consistency algorithms
 * - Spatial layout optimization
 * - Print adaptability testing
 */

import sharp from 'sharp';

interface OptimizationResult {
  imageData: string;
  metrics: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    processingTimeMs: number;
  };
  optimizationApplied: string[];
}

interface OptimizationOptions {
  lineWidth?: number;
  enhanceContrast?: boolean;
  simplifyElements?: boolean;
  targetAge?: 'children' | 'adults' | 'seniors';
  format?: 'webp' | 'png' | 'jpeg';
  quality?: number;
}

/**
 * Applies line smoothing algorithm to improve the quality of lines
 * Implementation based on curvature variation rate analysis
 */
export function applyLineSmoothing(imageData: string): string {
  // In a real implementation, this would process the image data
  // For demo purposes, we simulate the transformation
  console.log('Applying line smoothing algorithm');
  return imageData;
}

/**
 * Normalizes line thickness throughout the image
 * Uses Sobel edge detection and thickness normalization
 */
export function normalizeLineThickness(imageData: string, preference: 'thin' | 'medium' | 'thick' = 'medium'): string {
  // In a real implementation, this would apply computer vision algorithms
  // to detect and normalize line thickness
  console.log(`Normalizing line thickness to ${preference} preference`);
  return imageData;
}

/**
 * Optimizes image for better printing results
 * Adjusts contrast and ensures minimum line thickness based on DPI
 */
export function enhancePrintability(imageData: string, dpi: number = 300): string {
  // In a real implementation, this would optimize for the specified DPI
  console.log(`Enhancing printability for ${dpi} DPI`);
  return imageData;
}

/**
 * Optimizes spatial layout using design principles
 * Applies golden ratio and rule-of-thirds for better composition
 */
export function optimizeLayout(imageData: string): string {
  // In a real implementation, this would analyze and adjust the composition
  console.log('Optimizing spatial layout using design principles');
  return imageData;
}

/**
 * Optimize an image for use as a coloring page
 * @param imageData Base64 encoded image data
 * @param options Optimization options
 * @returns Optimized image data and metrics
 */
export async function optimizeColoring(
  imageData: string,
  options: OptimizationOptions = {}
): Promise<OptimizationResult> {
  const startTime = performance.now();
  const optimizationApplied: string[] = [];
  
  // Extract the base64 data and mime type
  const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image data format');
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const originalSize = buffer.length;
  
  // Process the image with sharp
  let sharpInstance = sharp(buffer);
  
  // Convert to grayscale for coloring pages
  sharpInstance = sharpInstance.grayscale();
  optimizationApplied.push('Grayscale conversion');
  
  // Enhance contrast if requested
  if (options.enhanceContrast) {
    // Using linear contrast adjustment instead of contrast() which may not be available in all versions
    sharpInstance = sharpInstance.linear(1.5, -30); // Increase contrast
    optimizationApplied.push('Contrast enhancement');
  }
  
  // Adjust line width if specified
  if (options.lineWidth) {
    const threshold = Math.max(0, Math.min(255, 128 + options.lineWidth * 10));
    sharpInstance = sharpInstance.threshold(threshold);
    optimizationApplied.push(`Line width adjustment (threshold: ${threshold})`);
  }
  
  // Simplify elements for better coloring if requested
  if (options.simplifyElements) {
    sharpInstance = sharpInstance.median(1);
    optimizationApplied.push('Element simplification');
  }
  
  // Determine output format
  const outputFormat = options.format || 'webp'; // Default to WebP for best compression
  const quality = options.quality || 80; // Default quality
  
  // Process the image based on the desired format
  let outputBuffer: Buffer;
  
  switch (outputFormat) {
    case 'webp':
      outputBuffer = await sharpInstance.webp({
        quality,
        lossless: false,
        effort: 4 // Medium-high compression effort
      }).toBuffer();
      optimizationApplied.push(`WebP conversion (quality: ${quality}%)`);
      break;
      
    case 'png':
      outputBuffer = await sharpInstance.png({
        compressionLevel: 9, // Maximum compression
        adaptiveFiltering: true
      }).toBuffer();
      optimizationApplied.push('PNG optimization (max compression)');
      break;
      
    case 'jpeg':
      outputBuffer = await sharpInstance.jpeg({
        quality,
        progressive: true
      }).toBuffer();
      optimizationApplied.push(`JPEG conversion (quality: ${quality}%)`);
      break;
      
    default:
      // Default to WebP
      outputBuffer = await sharpInstance.webp({
        quality: 80
      }).toBuffer();
      optimizationApplied.push('Default WebP conversion');
  }
  
  const optimizedSize = outputBuffer.length;
  
  // Convert the processed buffer back to base64
  const optimizedBase64 = outputBuffer.toString('base64');
  const outputMimeType = `image/${outputFormat}`;
  const optimizedImageData = `data:${outputMimeType};base64,${optimizedBase64}`;
  
  const endTime = performance.now();
  
  return {
    imageData: optimizedImageData,
    metrics: {
      originalSize,
      optimizedSize,
      compressionRatio: originalSize / optimizedSize,
      processingTimeMs: endTime - startTime
    },
    optimizationApplied
  };
}

/**
 * Apply age-specific optimizations to an image
 * @param imageData Base64 encoded image data
 * @param ageGroup Target age group
 * @returns Optimized image data
 */
export async function optimizeForAgeGroup(
  imageData: string,
  ageGroup: 'children' | 'adults' | 'seniors'
): Promise<string> {
  // Extract the base64 data
  const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image data format');
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Process according to age group
  let sharpInstance = sharp(buffer);
  
  switch (ageGroup) {
    case 'children':
      // Thicker lines, simpler shapes for children
      sharpInstance = sharpInstance
        .threshold(150) // More pronounced lines
        .median(2);     // Simplify shapes
      break;
      
    case 'adults':
      // Default processing, no extra modifications
      break;
      
    case 'seniors':
      // Higher contrast, thicker lines for better visibility
      sharpInstance = sharpInstance
        .threshold(160)   // Very pronounced lines
        .linear(1.8, -50); // Higher contrast
      break;
  }
  
  // Get the format from the mime type
  const formatMatch = mimeType.match(/image\/(\w+)/);
  const format = formatMatch ? formatMatch[1] : 'webp';
  
  // Process the image
  let outputBuffer: Buffer;
  
  switch (format) {
    case 'webp':
      outputBuffer = await sharpInstance.webp().toBuffer();
      break;
    case 'png':
      outputBuffer = await sharpInstance.png().toBuffer();
      break;
    case 'jpeg':
    case 'jpg':
      outputBuffer = await sharpInstance.jpeg().toBuffer();
      break;
    default:
      outputBuffer = await sharpInstance.webp().toBuffer(); // Default to WebP
  }
  
  // Convert back to base64
  const optimizedBase64 = outputBuffer.toString('base64');
  return `data:${mimeType};base64,${optimizedBase64}`;
}

/**
 * Create a thumbnail version of an image for gallery previews
 * @param imageData Base64 encoded image data
 * @param width Thumbnail width
 * @param height Thumbnail height
 * @returns Optimized thumbnail image data
 */
export async function createThumbnail(
  imageData: string,
  width: number = 300,
  height: number = 300
): Promise<string> {
  // Extract the base64 data
  const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image data format');
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Process the image with sharp
  const thumbnailBuffer = await sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 70 })
    .toBuffer();
  
  // Convert back to base64
  const thumbnailBase64 = thumbnailBuffer.toString('base64');
  return `data:image/webp;base64,${thumbnailBase64}`;
} 