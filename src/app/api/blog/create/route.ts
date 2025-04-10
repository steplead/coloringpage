import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateBlogPost } from '@/lib/blog/generator';
import { BlogPostTemplateProps } from '@/lib/blog/postTemplate';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123'; // Should be stored securely in production

/**
 * API route for creating blog posts
 * This handles both automated and manual blog post creation
 */
export async function POST(request: NextRequest) {
  try {
    // Basic authentication - in production use proper auth
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Option 1: Generate post using AI
    if (body.generatePost) {
      const { topic, keyword } = body;
      
      if (!topic || !keyword) {
        return NextResponse.json(
          { error: 'Missing required parameters: topic and keyword' },
          { status: 400 }
        );
      }
      
      // Generate SEO-optimized blog post
      const generatedPost = await generateBlogPost(topic, keyword);
      
      // Save to database
      const { data, error } = await savePostToDatabase(generatedPost);
      
      if (error || !data) {
        console.error('Error saving generated post:', error);
        return NextResponse.json(
          { error: 'Failed to save blog post to database' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Blog post generated and saved successfully',
        id: data.id,
        slug: generatedPost.slug
      });
    }
    
    // Option 2: Create post from provided data
    else {
      const { postData } = body;
      
      if (!validateBlogPostData(postData)) {
        return NextResponse.json(
          { error: 'Invalid blog post data' },
          { status: 400 }
        );
      }
      
      // Save to database
      const { data, error } = await savePostToDatabase(postData);
      
      if (error || !data) {
        console.error('Error saving post:', error);
        return NextResponse.json(
          { error: 'Failed to save blog post to database' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Blog post saved successfully',
        id: data.id,
        slug: postData.slug
      });
    }
  } catch (error) {
    console.error('Error in blog post creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate incoming blog post data
 */
function validateBlogPostData(postData: any): boolean {
  // Ensure required fields are present
  if (!postData?.title || !postData?.metaDescription || !postData?.slug || !postData?.sections) {
    return false;
  }
  
  // Check that sections are properly formatted
  if (!Array.isArray(postData.sections) || postData.sections.length === 0) {
    return false;
  }
  
  // Validate slug format (alphanumeric, hyphens only)
  if (!/^[a-z0-9-]+$/.test(postData.slug)) {
    return false;
  }
  
  return true;
}

/**
 * Save blog post to database
 */
async function savePostToDatabase(postData: BlogPostTemplateProps) {
  try {
    // Convert template format to database format
    const dbEntry = {
      title: postData.title,
      slug: postData.slug,
      meta_description: postData.metaDescription,
      content: convertSectionsToHTML(postData),
      featured_image_url: postData.featuredImageUrl,
      tags: postData.tags,
      is_published: true,
      created_at: new Date().toISOString(),
      seo_data: {
        primaryKeyword: postData.primaryKeyword,
        keywords: postData.secondaryKeywords,
        structuredData: generateStructuredData(postData)
      }
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(dbEntry)
      .select('id')
      .single();
    
    if (error) throw error;
    
    // Update sitemap
    await updateSitemap(postData.slug);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in savePostToDatabase:', error);
    return { data: null, error };
  }
}

/**
 * Convert structured sections to HTML content
 */
function convertSectionsToHTML(postData: BlogPostTemplateProps): string {
  let htmlContent = '';
  
  // Add introduction
  htmlContent += `<p>Welcome to our guide on <strong>${postData.primaryKeyword}</strong>. 
    This article will provide you with valuable insights, practical tips, and creative ideas 
    to enhance your coloring experience.</p>`;
  
  // Add all content sections
  postData.sections.forEach(section => {
    htmlContent += `<h2>${section.heading}</h2>${section.content}`;
    
    // Add section image if available
    if (section.imageUrl) {
      htmlContent += `<figure>
        <img src="${section.imageUrl}" alt="${section.imageAlt || section.heading}" />
        <figcaption>${section.imageAlt || ''}</figcaption>
      </figure>`;
    }
  });
  
  // Add coloring page examples if available
  if (postData.coloringPageExamples && postData.coloringPageExamples.length > 0) {
    htmlContent += `<h2>Free Coloring Page Examples</h2>
    <div class="coloring-examples">`;
    
    postData.coloringPageExamples.forEach(example => {
      htmlContent += `<div class="coloring-example">
        <img src="${example.url}" alt="${example.alt}" />
        <h3>${example.title}</h3>
        <a href="/download?url=${encodeURIComponent(example.url)}&title=${encodeURIComponent(example.title)}">
          Download This Page
        </a>
      </div>`;
    });
    
    htmlContent += `</div>`;
  }
  
  // Add FAQ section if available
  if (postData.faqs && postData.faqs.length > 0) {
    htmlContent += `<h2>Frequently Asked Questions</h2>`;
    
    postData.faqs.forEach(faq => {
      htmlContent += `<h3>${faq.question}</h3>${faq.answer}`;
    });
  }
  
  // Add conclusion
  htmlContent += `<h2>Conclusion</h2>${postData.conclusion}`;
  
  // Add call to action
  htmlContent += `<div class="call-to-action">${postData.callToAction}</div>`;
  
  return htmlContent;
}

/**
 * Generate structured data for SEO
 */
function generateStructuredData(postData: BlogPostTemplateProps): any {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": postData.title,
    "description": postData.metaDescription,
    "image": postData.featuredImageUrl,
    "author": {
      "@type": "Person",
      "name": postData.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Coloring Page",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ai-coloringpage.com/logo.png"
      }
    },
    "datePublished": postData.publishDate,
    "dateModified": postData.modifiedDate || postData.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ai-coloringpage.com/blog/${postData.slug}`
    }
  };
  
  // Add FAQ schema if FAQs exist
  if (postData.faqs && postData.faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": postData.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    // Return both schemas
    return {
      article: articleSchema,
      faq: faqSchema
    };
  }
  
  return articleSchema;
}

/**
 * Update sitemap with new blog post
 * In a production environment, this would write to the actual sitemap file
 */
async function updateSitemap(slug: string): Promise<void> {
  // Placeholder for sitemap update logic
  console.log(`Added blog post ${slug} to sitemap`);
  
  // In real implementation:
  // 1. Read existing sitemap.xml
  // 2. Add new URL entry
  // 3. Write updated sitemap
  // 4. Ping search engines about update
}

/**
 * Get a list of all blog posts - GET method
 */
export async function GET(request: NextRequest) {
  try {
    // Basic authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, is_published, created_at, tags')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      posts: data
    });
  } catch (error) {
    console.error('Error in blog posts fetch:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 