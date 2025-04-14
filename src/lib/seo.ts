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

/**
 * Ensure an image has complete SEO metadata
 * Fills in any missing metadata fields based on existing information
 * 
 * @param image The image record to enhance
 * @returns Enhanced image record with complete SEO metadata
 */
export function ensureCompleteImageMetadata(image: any): any {
  if (!image) return image;

  const enhancedImage = { ...image };
  
  // Generate base prompt if missing
  const basePrompt = image.prompt || 'coloring page';
  
  // Fill in missing title
  if (!enhancedImage.title) {
    enhancedImage.title = generateTitle(basePrompt, image.style);
  }
  
  // Fill in missing alt text
  if (!enhancedImage.alt_text) {
    enhancedImage.alt_text = generateAltText(basePrompt, image.style);
  }
  
  // Fill in missing SEO description
  if (!enhancedImage.seo_description) {
    enhancedImage.seo_description = generateDescription(basePrompt, image.style);
  }
  
  // Fill in missing caption
  if (!enhancedImage.caption) {
    enhancedImage.caption = generateCaption(basePrompt, image.style);
  }
  
  // Fill in missing keywords
  if (!enhancedImage.keywords || !Array.isArray(enhancedImage.keywords) || enhancedImage.keywords.length === 0) {
    enhancedImage.keywords = generateKeywords(basePrompt, image.style);
  }
  
  // Fill in missing filename
  if (!enhancedImage.seo_filename) {
    enhancedImage.seo_filename = generateFilename(basePrompt);
  }
  
  return enhancedImage;
}

/**
 * Update image metadata in the database
 * 
 * @param supabase Supabase client instance
 * @param imageId ID of the image to update
 * @param metadata New metadata to apply
 * @returns Result of the update operation
 */
export async function updateImageMetadata(supabase: any, imageId: string, metadata: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('images')
      .update({
        title: metadata.title,
        alt_text: metadata.alt_text,
        seo_description: metadata.seo_description,
        caption: metadata.caption,
        keywords: metadata.keywords,
        seo_filename: metadata.seo_filename,
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId)
      .select();
      
    if (error) {
      console.error('Error updating image metadata:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Exception updating image metadata:', error);
    return { success: false, error };
  }
}

/**
 * Ensure all images referenced in blog content have complete metadata
 * 
 * @param content HTML content of the blog post
 * @param supabase Supabase client instance for database updates
 */
export async function ensureBlogImagesHaveMetadata(content: string, supabase: any): Promise<void> {
  try {
    // Extract all gallery image IDs from the content
    const galleryRegex = /\/gallery\/([a-zA-Z0-9-]+)/g;
    const matches = Array.from(content.matchAll(galleryRegex));
    const imageIds = new Set<string>();
    
    for (const match of matches) {
      if (match[1]) {
        imageIds.add(match[1]);
      }
    }
    
    if (imageIds.size === 0) return;
    
    console.log(`Found ${imageIds.size} gallery images in blog content to check metadata`);
    
    // Check and update metadata for each image
    for (const imageId of Array.from(imageIds)) {
      const { data: image } = await supabase
        .from('images')
        .select('*')
        .eq('id', imageId)
        .single();
      
      if (image) {
        // Check if image needs metadata enhancement
        const needsUpdate = !image.title || 
                           !image.alt_text || 
                           !image.seo_description || 
                           !image.caption || 
                           !image.keywords || 
                           !image.seo_filename;
        
        if (needsUpdate) {
          console.log(`Enhancing metadata for image ${imageId}`);
          const enhancedImage = ensureCompleteImageMetadata(image);
          await updateImageMetadata(supabase, imageId, enhancedImage);
        }
      }
    }
  } catch (error) {
    console.error('Error ensuring blog images have metadata:', error);
    // Continue without failing the entire process
  }
}

/**
 * Generate schema markup for blog posts
 * Creates both Article and ImageObject schema.org structures
 * 
 * @param data Object containing blog post and image data
 * @returns JSON-LD schema markup as a string
 */
export function generateBlogSchema(data: {
  title: string;
  description: string;
  content: string;
  slug: string;
  image: any;
  publishDate: string;
  modifiedDate: string;
  tags: string[];
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  
  // Create Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image?.image_url,
    datePublished: data.publishDate,
    dateModified: data.modifiedDate,
    author: {
      '@type': 'Organization',
      name: 'AI Coloring Page',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Coloring Page',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    keywords: data.tags.join(', '),
    url: `${baseUrl}/blog/${data.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${data.slug}`
    }
  };
  
  // Create ImageObject schema for the featured image
  const imageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: data.image?.image_url,
    name: data.image?.title || data.title,
    description: data.image?.seo_description || data.description,
    caption: data.image?.caption || `A coloring page of ${data.title}`,
    creditText: 'AI Coloring Page',
    creator: {
      '@type': 'Organization',
      name: 'AI Coloring Page',
      url: baseUrl
    },
    copyrightNotice: `© ${new Date().getFullYear()} AI Coloring Page`,
    license: 'https://creativecommons.org/licenses/by-nc/4.0/'
  };
  
  // Return both schemas
  return JSON.stringify({
    article: articleSchema,
    image: imageSchema
  });
} 