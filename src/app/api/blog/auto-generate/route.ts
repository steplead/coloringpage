import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/gemini';
import { supabase, ImageRecord } from '@/lib/supabase';
import { createSlug } from '@/utils/string';
import { BlogPost } from '../route';
import { analyzeContent, calculateSeoScore, ContentAnalysisResult } from '@/lib/blog/contentAnalyzer';
import { ensureCompleteImageMetadata } from '@/lib/seo';

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
    } catch (dbError: unknown) {
        console.error('Error fetching settings for auto-generate:', dbError instanceof Error ? dbError.message : dbError);
        // Proceed with default settings if DB fetch fails, but log the error
    }

    // Use post count from settings
    const count = settings.postCount;
    
    // Parse request body for targetLength (optional, might be passed manually)
    let requestData = {};
    try {
        requestData = await request.json();
    } catch (parseError: unknown) {
        console.warn('Could not parse request body for targetLength:', parseError instanceof Error ? parseError.message : parseError);
        // Proceed with empty object if parsing fails
    }

    const {
      targetLength = 1500, // Default length if not passed in body
      // Add any other expected properties from requestData here with defaults
    } = requestData as { targetLength?: number /* Add other properties */ };

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
      
      let imagesToProcess: ImageRecord[] = [];

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
    } catch (error: unknown) {
      console.error('Error during blog generation process:', error instanceof Error ? error.message : error);
      return NextResponse.json(
        { error: 'Failed to auto-generate blog posts', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error parsing request or initial setup:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

/**
 * Process a set of gallery images to generate blog posts
 */
async function processGalleryImages(
  images: ImageRecord[], 
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

    // Map ImageRecord to the structure expected by generateBlogPost
    const imageDetailsForGemini = image ? { 
      id: image.id,
      imageUrl: image.image_url, // Use image_url from ImageRecord
      title: image.title || 'Untitled Coloring Page',
      description: image.seo_description || image.prompt || 'A detailed coloring page.', // Prioritize seo_description
      keywords: image.keywords || [],
      prompt: image.prompt || ''
    } : undefined;

    const imageIdentifier = { id: image.id, title: image.title || '(Untitled)' };
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
      
      const generated = await generateBlogPost(topic, targetLength, imageDetailsForGemini);
      
      // Only clean based on image details if they exist
      let cleanedContent = generated.content;
      if (imageDetailsForGemini) {
        cleanedContent = validateAndCleanContent(cleanedContent, imageDetailsForGemini);
      }

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
        tags: imageDetailsForGemini?.keywords || [topic, 'coloring page', 'printable'],
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      });
      
      const newPost: ExtendedBlogPost = {
        slug,
        title: generated.title,
        content: cleanedContent,
        meta_description: generated.description,
        tags: imageDetailsForGemini?.keywords || [topic, 'coloring page', 'printable'],
        featured_image_url: imageDetailsForGemini?.imageUrl,
        related_coloring_page_id: imageDetailsForGemini?.id,
        is_published: true,
        created_at: new Date().toISOString(),
        seo_data: {
          primaryKeyword: topic,
          keywords: imageDetailsForGemini?.keywords || [topic, 'coloring page', 'printable'],
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
    } catch (error: unknown) {
      console.error(`Failed to generate blog post for image ${image.id}:`, error instanceof Error ? error.message : error);
      results.push({ 
        image: imageIdentifier, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown processing error' 
      });
    }

    results.push({ image: imageIdentifier, success, slug: success ? slug : undefined, error: !success ? errorMsg : undefined });
  }
}

/**
 * Extract a topic from image metadata
 */
function getTopic(image: ImageRecord): string {
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
 * Generate schema markup for SEO
 */
function generateSchemaMarkup(data: {
  title: string;
  description: string;
  image: ImageRecord;
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
 * Define the expected structure for image details within this module
 */
interface BlogGenImageDetails {
  imageUrl: string;
  title: string;
  description: string;
  keywords: string[];
  prompt: string;
  id: string;
}

/**
 * Validate and clean blog content to remove generic patterns
 * Uses the BlogGenImageDetails structure consistent with generateBlogPost
 */
function validateAndCleanContent(content: string, imageDetails: BlogGenImageDetails): string {
  let cleaned = content;

  // Define patterns to remove (case-insensitive)
  const genericPatterns = [
    /^\s*Welcome to our guide on.*?\n/gim,
    /^\s*In this article, we explore.*?\n/gim,
    // Use imageDetails.title safely
    new RegExp(`(?:About|Learn more about)\s*${escapeRegex(imageDetails.title || '')}`, 'gim'),
    /Discover the benefits of coloring.*?\n/gim,
    /Frequently Asked Questions.*?(\n|$)/gim,
    /FAQ.*?(\n|$)/gim,
    /Testimonial:.*?\n/gim,
    /"I love these pages!" -.*?\n/gim,
    /Visit our website.*?\n/gim,
    /Check out our collection.*?\n/gim,
    // Added pattern to catch variations of introduction
    /^\s*Explore the world of.*?coloring pages.*?\n/gim,
    /^\s*Get ready to unleash your creativity.*?\n/gim,
    // Added pattern for generic call-to-actions
    /Download your free printable.*?now!*?\n/gim,
    /Start coloring today!*?\n/gim,
    // Add more specific patterns based on observed generic content
  ];

  genericPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });

  // Remove redundant mentions of the title if they seem generic
  // (Example: "Let's talk about Mountain Landscape Coloring Page")
  // Use title safely
  const redundantTitlePattern = new RegExp(`(?:Let's talk about|Learn about|Discover|Explore)\s*${escapeRegex(imageDetails.title || '')}`, 'gim');
  cleaned = cleaned.replace(redundantTitlePattern, imageDetails.title || ''); // Replace with just the title potentially

  // Trim whitespace
  cleaned = cleaned.trim();

  // Ensure content didn't become empty
  if (!cleaned) {
    console.warn('Content became empty after cleaning, returning original short version.');
    // Return a snippet of original content if cleaning failed badly
    return content.substring(0, 300) + '...';
  }

  return cleaned;
}

// Helper to escape regex special characters
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
} 