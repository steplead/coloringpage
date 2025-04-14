import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, cleanContent } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { createSlug } from '@/utils/string';
import { BlogPost } from '../route';
import { analyzeContent, calculateSeoScore, ContentAnalysisResult } from '@/lib/blog/contentAnalyzer';
import { ensureCompleteImageMetadata, ensureBlogImagesHaveMetadata } from '@/lib/seo';

// Define settings table name
const SETTINGS_TABLE = 'app_settings';

// Extending BlogPost interface to include seo_data if it's missing
interface ExtendedBlogPost extends BlogPost {
  seo_data?: {
    primaryKeyword: string;
    keywords: string[];
    focusKeyphrase: string;
    cornerstoneContent: boolean;
    readabilityScore: number;
    uniquenessScore?: number;
    contentHash?: string;
    seoScore?: number;
    keywordDensity?: number;
    wordCount?: number;
  };
  // Additional fields for database schema updates
  uniqueness_score?: number;
  content_hash?: string;
  primary_keyword?: string;
  readability_score?: number;
  is_auto_generated?: boolean;
  generation_model?: string;
  generated_at?: string;
  category?: string;
  is_cornerstone?: boolean;
  schema_markup?: string; // Added schema_markup field for structured data
}

// Topics related to coloring pages for auto-generation
const COLORING_TOPICS = [
  'animal',
  'dinosaur',
  'princess',
  'superhero',
  'space',
  'ocean',
  'holiday',
  'seasons',
  'educational',
  'fantasy',
  'vehicles',
  'nature',
  'sports',
  'flowers',
  'architecture',
  'cartoon characters',
  'mandala',
  'geometric patterns',
  // Adding more diverse and specific topics
  'science experiments',
  'historical figures',
  'endangered species',
  'world landmarks',
  'musical instruments',
  'mythological creatures',
  'cultural traditions',
  'weather phenomena',
  'insects and bugs',
  'marine life',
  'habitats',
  'solar system',
  'emotions and feelings',
  'famous artists',
  'transportation methods',
  'careers and professions'
];

// Topic variants to increase uniqueness of content
const TOPIC_MODIFIERS = [
  'beginner',
  'advanced',
  'educational',
  'fun',
  'interactive',
  'themed',
  'seasonal',
  'creative',
  'detailed',
  'simple',
  'realistic',
  'cartoon-style',
  'printable',
  'step-by-step',
  'family-friendly'
];

/**
 * Get gallery images that haven't been used in blog posts yet
 * Select images chronologically to ensure we use the most recent first
 */
async function getUnusedGalleryImages(limit = 50) {
  // First get all existing blog posts that have related image IDs
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('related_coloring_page_id')
    .not('related_coloring_page_id', 'is', null);
  
  // Extract the image IDs that are already used
  const usedImageIds = blogPosts?.map(post => post.related_coloring_page_id) || [];
  
  // Get the most recently created images that haven't been used in blog posts
  const { data: images } = await supabase
    .from('images')
    .select('*')
    // Ensure we only select images that have not been used yet
    .not('id', 'in', `(${usedImageIds.join(',')})`)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return images || [];
}

/**
 * POST handler for automatic blog post generation
 * Generates multiple blog posts based on gallery images
 */
export async function POST(request: NextRequest) {
  // Authorization Check for Cron Job
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
     console.log('Unauthorized attempt to trigger blog generation.');
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!cronSecret) {
     console.warn('CRON_SECRET is not set. Blog generation endpoint is unsecured.');
  }

  try {
    // --- Check if Auto-Posting is Enabled in Settings --- 
    let settings = { postCount: 1, autoBlogEnabled: true }; // Defaults
    try {
        const { data: settingsData, error: settingsError } = await supabase
            .from(SETTINGS_TABLE)
            .select('post_count, auto_blog_enabled')
            .eq('id', 'blog_settings')
            .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
            throw settingsError; // Throw real errors
        }
        if (settingsData) {
            settings = {
                postCount: settingsData.post_count ?? 1,
                autoBlogEnabled: settingsData.auto_blog_enabled ?? true
            };
        }
    } catch (dbError: any) {
        console.error('Error fetching settings for auto-generate:', dbError.message);
        // Proceed with default settings if DB fetch fails, but log the error
    }

    if (!settings.autoBlogEnabled) {
        console.log('Auto-posting is disabled in settings. Skipping generation.');
        return NextResponse.json({ success: true, message: 'Auto-posting is disabled.', generated: 0, failed: 0, results: [] });
    }
    // --- End Check --- 

    // Use post count from settings
    const count = settings.postCount;
    
    // Parse request body for targetLength (optional, might be passed manually)
    const requestData = await request.json().catch(() => ({}));
    const {
      targetLength = 1500 // Default length if not passed in body
    } = requestData;

    console.log(`Auto-generating ${count} blog posts (enabled)... Triggered by ${cronSecret ? 'Cron Job' : 'Manual Request'}`);

    const results: { 
      image: { id: string, title: string } | null;
      success: boolean; 
      slug?: string; 
      error?: string 
    }[] = [];
    
    try {
      // Get available images
      const unusedImages = await getUnusedGalleryImages(count * 2);
      console.log(`Found ${unusedImages.length} unused gallery images.`);
      
      let imagesToProcess: any[] = [];

      if (unusedImages.length >= count) {
        imagesToProcess = unusedImages.slice(0, count);
      } else {
        console.log(`Not enough unused images (${unusedImages.length}/${count}). Attempting reuse.`);
        imagesToProcess = [...unusedImages];
        const needed = count - unusedImages.length;

        const { data: oldestBlogPosts } = await supabase
          .from('blog_posts')
          .select('related_coloring_page_id')
          .not('related_coloring_page_id', 'is', null)
          .order('created_at', { ascending: true })
          .limit(needed * 2);

        const reusedImageIds = oldestBlogPosts?.map(p => p.related_coloring_page_id).filter(id => id) || [];
        
        if (reusedImageIds.length > 0) {
           const { data: imagesToReuse } = await supabase
            .from('images')
            .select('*')
            .in('id', reusedImageIds)
            .limit(needed);
            
           if (imagesToReuse && imagesToReuse.length > 0) {
             console.log(`Found ${imagesToReuse.length} older images to reuse.`);
             imagesToProcess.push(...imagesToReuse);
           }
        }
      }

      if (imagesToProcess.length === 0) {
           console.error('No images found for blog post generation.');
           return NextResponse.json({
             success: false,
             error: `No images found for blog post generation.`
           }, { status: 400 });
      }

      const actualCount = Math.min(count, imagesToProcess.length);
      if (actualCount < count) {
           console.warn(`Not enough images (${imagesToProcess.length}/${count}). Proceeding with ${actualCount}.`);
      }
       
      // Process the selected images (up to the actual count)
      await processGalleryImages(imagesToProcess.slice(0, actualCount), results, targetLength);
      
      // Removed call to ensureBlogImagesHaveMetadata() here.
      // Consider a separate cron job for this task if needed.
      // await ensureBlogImagesHaveMetadata(); 

      return NextResponse.json({
        success: true,
        generated: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      });
    } catch (error: any) {
      console.error('Error during blog generation process:', error);
      return NextResponse.json(
        { error: 'Failed to auto-generate blog posts', details: error.message || 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error parsing request or initial setup:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message || 'Unknown error' },
      { status: 400 }
    );
  }
}

/**
 * Process a set of gallery images to generate blog posts
 */
async function processGalleryImages(
  images: any[], 
  results: { image: { id: string, title: string } | null; success: boolean; slug?: string; error?: string }[],
  targetLength: number = 1500
) {
  const processedImageIds = new Set<string>();

  for (const image of images) {
    if (!image || !image.id) {
        console.warn('Skipping invalid image object:', image);
        results.push({ image: null, success: false, error: 'Invalid image data provided.'});
        continue;
    }

    if (processedImageIds.has(image.id)) {
       console.log(`Skipping already processed image in this batch: ${image.id}`);
       continue;
    }
    processedImageIds.add(image.id);

    const imageIdentifier = { id: image.id, title: image.title || 'Untitled' };
    let success = false;
    let slug = '';
    let errorMsg = '';

    try {
      const enhancedImage = await ensureCompleteImageMetadata(image);
      imageIdentifier.title = enhancedImage.title || 'Untitled';
      
      // Update image metadata in DB
      const { error: updateError } = await supabase
        .from('images')
        .update({
          title: enhancedImage.title,
          alt_text: enhancedImage.alt_text,
          seo_description: enhancedImage.seo_description,
          caption: enhancedImage.caption,
          keywords: enhancedImage.keywords,
          seo_filename: enhancedImage.seo_filename,
          updated_at: new Date().toISOString()
        })
        .eq('id', enhancedImage.id);
      if (updateError) {
          console.warn(`Error updating metadata for image ${enhancedImage.id}:`, updateError.message);
          // Continue even if metadata update fails
      }
      
      const topic = getTopic(enhancedImage);
      console.log(`Generating blog post for image "${enhancedImage.title}" with topic: ${topic}`);
      
      const imageDetails = {
        id: enhancedImage.id,
        imageUrl: enhancedImage.image_url,
        title: enhancedImage.title || topic,
        description: enhancedImage.seo_description || enhancedImage.caption || `A ${topic} coloring page`,
        keywords: enhancedImage.keywords || [topic, 'coloring page', 'printable'],
        prompt: enhancedImage.prompt || topic,
      };
      
      const generated = await generateBlogPost(topic, targetLength, imageDetails);
      let cleanedContent = validateAndCleanContent(generated.content, imageDetails);
      
      if (!cleanedContent || cleanedContent.length < 300) {
         throw new Error('Generated content too short or invalid after cleaning.');
      }
      
      slug = createSlug(generated.title);
      
      // Correctly await analyzeContent and pass individual arguments
      const analysis: ContentAnalysisResult = await analyzeContent(
        cleanedContent, 
        generated.title, 
        topic 
      ); 
      
      // Pass analysis result to calculateSeoScore
      const seoScore = calculateSeoScore(analysis); 
      console.log(`Content Analysis for "${generated.title}":`, { ...analysis, seoScore });

      // Correctly pass args to generateSchemaMarkup
      const schemaMarkup = generateSchemaMarkup({
        title: generated.title,
        description: generated.description,
        image: enhancedImage, // Pass the full enhanced image object
        slug: slug,
        tags: imageDetails.keywords,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      });
      
      const newPost: ExtendedBlogPost = {
        slug,
        title: generated.title,
        content: cleanedContent,
        meta_description: generated.description,
        tags: imageDetails.keywords,
        featured_image_url: imageDetails.imageUrl,
        related_coloring_page_id: imageDetails.id,
        is_published: true,
        created_at: new Date().toISOString(),
        seo_data: {
          primaryKeyword: topic,
          keywords: imageDetails.keywords,
          focusKeyphrase: topic,
          cornerstoneContent: false,
          readabilityScore: analysis.readabilityScore,
          uniquenessScore: analysis.uniquenessScore,
          contentHash: analysis.contentHash,
          seoScore: seoScore,
          keywordDensity: analysis.keywordDensity,
          wordCount: analysis.wordCount,
        },
        uniqueness_score: analysis.uniquenessScore,
        content_hash: analysis.contentHash,
        primary_keyword: topic,
        readability_score: analysis.readabilityScore,
        is_auto_generated: true,
        generation_model: process.env.GEMINI_MODEL || 'gemini-pro',
        generated_at: new Date().toISOString(),
        is_cornerstone: false,
        schema_markup: schemaMarkup
      };

      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([newPost])
        .select();
      
      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      console.log(`Successfully generated and inserted blog post: ${slug}`);
      success = true;
    } catch (err: any) {
      console.error(`Error generating blog post for image ${imageIdentifier.id} ("${imageIdentifier.title}"):`, err);
      errorMsg = err.message || 'Unknown error during generation';
      success = false;
    }

    results.push({ image: imageIdentifier, success, slug: success ? slug : undefined, error: !success ? errorMsg : undefined });
  }
}

/**
 * Extract a topic from image metadata
 */
function getTopic(image: any): string {
  // First check for keywords
  if (image.keywords && Array.isArray(image.keywords) && image.keywords.length > 0) {
    // Use the first keyword as the topic if it's not too generic
    const genericTerms = ['coloring', 'page', 'printable', 'drawing', 'art'];
    const betterKeywords = image.keywords.filter((k: string) => 
      k && k.length > 3 && !genericTerms.includes(k.toLowerCase())
    );
    
    if (betterKeywords.length > 0) {
      return betterKeywords[0];
    }
  }
  
  // If no good keywords, try to extract from title
  if (image.title) {
    const titleWords = image.title.split(' ')
      .filter((word: string) => word.length > 3)
      .filter((word: string) => !['coloring', 'page', 'printable'].includes(word.toLowerCase()));
    
    if (titleWords.length > 0) {
      return titleWords[0];
    }
  }
  
  // If no title, try to extract from prompt
  if (image.prompt) {
    const promptWords = image.prompt.split(' ')
      .filter((word: string) => word.length > 3)
      .filter((word: string) => !['coloring', 'page', 'drawing', 'line'].includes(word.toLowerCase()));
    
    if (promptWords.length > 0) {
      return promptWords[0];
    }
  }
  
  // Default to a generic topic
  return 'coloring';
}

/**
 * Insert an image at the top of the content
 */
function insertImageAtTop(content: string, image: any): string {
  // Create the image HTML
  const imageHtml = `
<figure class="featured-image mb-8">
  <img src="${image.imageUrl}" alt="${image.description || image.title || 'Coloring page'}" class="w-full h-auto rounded-lg shadow-md" />
  <figcaption class="text-center text-gray-600 mt-2">${image.title || 'Printable coloring page'}</figcaption>
</figure>
  `;
  
  // If content already has a figure or image tag near the top, replace it
  if (content.substring(0, 300).includes('<figure') || content.substring(0, 300).includes('<img')) {
    // Replace the first figure or img tag section
    return content.replace(/<figure[\s\S]*?<\/figure>|<img[\s\S]*?\/>/, imageHtml);
  }
  
  // If content starts with an h1 tag, insert after that
  if (content.substring(0, 100).includes('<h1')) {
    const h1EndIndex = content.indexOf('</h1>') + 5;
    return content.substring(0, h1EndIndex) + '\n' + imageHtml + '\n' + content.substring(h1EndIndex);
  }
  
  // Otherwise, just prepend the image to the content
  return imageHtml + '\n' + content;
}

/**
 * Generate schema markup for SEO
 */
function generateSchemaMarkup(data: {
  title: string;
  description: string;
  image: any; // Should be the full image object with image_url etc.
  slug: string;
  tags: string[];
  datePublished: string;
  dateModified: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';
  
  // Create Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image?.image_url, // Access image_url safely
    datePublished: data.datePublished,
    dateModified: data.dateModified,
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
  
  // Create ImageObject schema
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
  
  // Return both schemas as a JSON string for the database
  return JSON.stringify({
    article: articleSchema,
    image: imageSchema
  });
}

/**
 * Count keyword matches in an image (Used for potential future relevance scoring)
 */
function countKeywordMatches(image: any, keywords: string[]): number {
  let count = 0;
  
  // Check image keywords
  if (image.keywords && Array.isArray(image.keywords)) {
    for (const keyword of keywords) {
      count += image.keywords.filter((k: string) => 
        k && k.toLowerCase().includes(keyword.toLowerCase())
      ).length;
    }
  }
  
  // Check image title
  if (image.title) {
    for (const keyword of keywords) {
      if (image.title.toLowerCase().includes(keyword.toLowerCase())) {
        count++;
      }
    }
  }
  
  // Check image prompt
  if (image.prompt) {
    for (const keyword of keywords) {
      if (image.prompt.toLowerCase().includes(keyword.toLowerCase())) {
        count++;
      }
    }
  }
  
  return count;
}

/**
 * Helper function to generate tags from topic and title
 */
function generateTags(topic: string, title: string, relatedImages: any[] = []): string[] {
  // Base tags for coloring pages
  const baseTags = ['coloring pages', 'printable', 'activities'];
  
  // Add topic as tag
  const topicWords = topic.toLowerCase().split(' ');
  
  const tags = new Set<string>([
    ...baseTags, 
    ...topicWords, 
    topic.toLowerCase()
  ]);
  
  // Extract potential keywords from title
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 3) // Only include words longer than 3 chars
    .filter(word => !baseTags.includes(word)) // Exclude words already in base tags
    .slice(0, 5); // Limit to 5 additional keywords
  
  // Add filtered title words to tags
  titleWords.forEach(word => tags.add(word));
  
  // Add keywords from related images
  if (relatedImages && relatedImages.length > 0) {
    relatedImages.forEach(image => {
      if (image.keywords && Array.isArray(image.keywords)) {
        image.keywords
          .filter((k: string) => k && k.length > 3)
          .forEach((k: string) => tags.add(k.toLowerCase()));
      }
    });
  }
  
  return Array.from(tags);
}

// Generate a simple hash for content when our analyzer fails
function generateSimpleHash(content: string): string {
  let hash = 0;
  const sample = content.substring(0, 1000);
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * Validate and clean blog content to remove generic patterns
 */
function validateAndCleanContent(content: string, imageDetails: any): string {
  if (!content || typeof content !== 'string') {
    console.log('Invalid content detected, returning empty string');
    return '';
  }

  // Use the comprehensive cleaning function from gemini.ts
  let cleanedContent = cleanContent(content); // Assume cleanContent is imported
  
  // Check for the presence of image-specific content
  const requiredImageSpecificContent = [
    `${imageDetails.title}`,
    `specific`,
    `unique`,
    `this image`,
    `this design`,
    `this coloring page`
  ];
  
  // Count how many required elements are present
  const contentSpecificity = requiredImageSpecificContent.filter(phrase => 
    cleanedContent.toLowerCase().includes(phrase.toLowerCase())
  ).length;
  
  // Add a log about the content quality
  console.log(`Content specificity score: ${contentSpecificity}/${requiredImageSpecificContent.length}`);
  
  // Ensure the image is at the top
  cleanedContent = insertImageAtTop(cleanedContent, imageDetails);
  
  // Final check for extremely generic patterns (should have been caught by cleanContent)
  const genericPatterns = [
    'Welcome to our guide',
    'This article will provide you with',
    'coloring pages feature distinctive patterns',
    'designed with careful attention to detail and accessibility',
    'educational purposes and creative expression',
    'About coloring pages',
    'specialized designs',
    'distinctive patterns'
  ];
  
  // Log if any generic patterns are still found
  const foundPatterns = genericPatterns.filter(pattern => 
    cleanedContent.includes(pattern)
  );
  
  if (foundPatterns.length > 0) {
    console.warn('Found generic patterns after final cleaning:', foundPatterns);
    // Apply more aggressive removal again just in case
    foundPatterns.forEach(pattern => {
      cleanedContent = cleanedContent.replace(new RegExp(pattern, 'gi'), '');
    });
  }
  
  return cleanedContent.trim();
} 