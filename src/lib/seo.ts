/**
 * SEO Utilities for AI Coloring Page Generator
 * Provides functions to optimize content for search engines
 */

/**
 * Generate SEO-friendly image metadata based on user prompt
 * 
 * @param prompt The original user prompt
 * @param style The style used for generation (e.g., "simple", "cartoon")
 * @returns Object containing optimized image metadata
 */
export function generateImageMetadata(prompt: string, style?: string): ImageMetadata {
  // Clean and normalize the prompt
  const cleanPrompt = cleanText(prompt);
  
  // Generate title (60-65 characters max for SEO)
  const title = generateTitle(cleanPrompt, style);
  
  // Generate alt text (125 characters max recommended)
  const alt = generateAltText(cleanPrompt, style);
  
  // Generate filename (lowercase, no spaces, with dashes)
  const filename = generateFilename(cleanPrompt);
  
  // Generate description (150-160 characters for meta description)
  const description = generateDescription(cleanPrompt, style);
  
  // Generate caption (shorter, for image captions)
  const caption = generateCaption(cleanPrompt, style);
  
  // Generate keywords (for internal use and metadata)
  const keywords = generateKeywords(cleanPrompt, style);
  
  return {
    title,
    alt,
    filename,
    description,
    caption,
    keywords
  };
}

/**
 * Clean and normalize text by removing special characters
 */
function cleanText(text: string): string {
  return text
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and dashes
    .replace(/\s+/g, ' ')     // Replace multiple spaces with a single space
    .trim();
}

/**
 * Generate SEO-optimized title for an image
 */
function generateTitle(prompt: string, style?: string): string {
  let title = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  
  // Add style information if provided
  if (style && style.toLowerCase() !== 'standard') {
    title = `${title} - ${capitalize(style)} Style Coloring Page`;
  } else {
    title = `${title} Coloring Page`;
  }
  
  // Ensure the title isn't too long (60-65 chars max for SEO)
  return truncateWithEllipsis(title, 60);
}

/**
 * Generate descriptive alt text for an image
 */
function generateAltText(prompt: string, style?: string): string {
  let alt = `Printable coloring page of ${prompt.toLowerCase()}`;
  
  // Add style information if provided
  if (style && style.toLowerCase() !== 'standard') {
    alt = `${alt} in ${style.toLowerCase()} style`;
  }
  
  alt += " with black outline on white background for kids and adults";
  
  // Ensure alt text isn't too long (125 chars max recommended)
  return truncateWithEllipsis(alt, 125);
}

/**
 * Generate SEO-friendly filename
 */
function generateFilename(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/\s+/g, '-')    // Replace spaces with dashes
    .replace(/[^\w-]/g, '')  // Remove non-word chars except dashes
    .replace(/-+/g, '-')     // Replace multiple dashes with a single dash
    .replace(/^-|-$/g, '')   // Remove leading and trailing dashes
    + '-coloring-page.webp'; // Add suffix and extension
}

/**
 * Generate longer description for meta tags
 */
function generateDescription(prompt: string, style?: string): string {
  let description = `Free printable coloring page featuring ${prompt.toLowerCase()}`;
  
  // Add style information if provided
  if (style && style.toLowerCase() !== 'standard') {
    description += ` in ${style.toLowerCase()} art style`;
  }
  
  description += `. Perfect for children and adults who enjoy coloring activities. High-quality black and white outline drawing ready to print.`;
  
  // Ensure description isn't too long (150-160 chars for meta description)
  return truncateWithEllipsis(description, 155);
}

/**
 * Generate short caption for the image
 */
function generateCaption(prompt: string, style?: string): string {
  let caption = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  
  // Add style information if provided
  if (style && style.toLowerCase() !== 'standard') {
    caption += ` (${capitalize(style)} Style)`;
  }
  
  return truncateWithEllipsis(caption, 100);
}

/**
 * Generate relevant keywords based on the content
 */
function generateKeywords(prompt: string, style?: string): string[] {
  const keywords = [
    prompt.toLowerCase(),
    'coloring page',
    'printable',
    'black and white',
    'outline',
    'drawing'
  ];
  
  // Add style keyword if provided
  if (style && style.toLowerCase() !== 'standard') {
    keywords.push(style.toLowerCase());
    keywords.push(`${style.toLowerCase()} style`);
  }
  
  // Add age-related keywords
  keywords.push('kids coloring');
  keywords.push('adults coloring');
  
  // Add activity keywords
  keywords.push('coloring activity');
  keywords.push('art therapy');
  
  return keywords;
}

/**
 * Helper to capitalize first letter of a string
 */
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Truncate text to a maximum length while preserving whole words
 */
function truncateWithEllipsis(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Find the last space before maxLength
  const lastSpace = text.lastIndexOf(' ', maxLength - 3);
  if (lastSpace === -1) return text.slice(0, maxLength - 3) + '...';
  
  return text.slice(0, lastSpace) + '...';
}

/**
 * Interface for image metadata
 */
export interface ImageMetadata {
  title: string;      // Title for the image (60-65 chars)
  alt: string;        // Alt text (125 chars)
  filename: string;   // SEO-friendly filename
  description: string; // Meta description (150-160 chars)
  caption: string;    // Short caption for display
  keywords: string[]; // Relevant keywords for the image
} 