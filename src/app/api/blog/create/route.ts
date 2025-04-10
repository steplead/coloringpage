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

/**
 * Regenerate a blog post with our SEO template structure
 * This helps upgrade existing content to the new format
 */
export async function PUT(request: NextRequest) {
  try {
    // Basic authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug } = body;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing required parameter: slug' },
        { status: 400 }
      );
    }
    
    // Fetch the existing post from the database
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (fetchError || !existingPost) {
      console.error('Error fetching post to regenerate:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch blog post' },
        { status: 404 }
      );
    }
    
    // Generate improved content based on the existing post
    const regeneratedPost = await regenerateBlogPost(existingPost);
    
    // Update the post in the database
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        content: regeneratedPost.content,
        meta_description: regeneratedPost.meta_description,
        seo_data: {
          ...existingPost.seo_data,
          primaryKeyword: regeneratedPost.seo_data.primaryKeyword,
          keywords: regeneratedPost.seo_data.keywords,
          structuredData: regeneratedPost.seo_data.structuredData
        }
      })
      .eq('id', existingPost.id)
      .select('id, slug')
      .single();
    
    if (error || !data) {
      console.error('Error updating post with regenerated content:', error);
      return NextResponse.json(
        { error: 'Failed to update blog post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post regenerated successfully',
      id: data.id,
      slug: data.slug
    });
  } catch (error) {
    console.error('Error in blog post regeneration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Regenerate blog post content with improved SEO structure
 */
async function regenerateBlogPost(existingPost: any) {
  try {
    // Extract primary keyword from tags or title
    const primaryKeyword = existingPost.seo_data?.primaryKeyword || 
      (existingPost.tags && existingPost.tags.length > 0 ? existingPost.tags[0] : null) ||
      extractKeywordFromTitle(existingPost.title);
    
    // Create a template-compatible post object
    const templatePost: BlogPostTemplateProps = {
      title: existingPost.title,
      metaDescription: existingPost.meta_description,
      slug: existingPost.slug,
      primaryKeyword,
      secondaryKeywords: existingPost.seo_data?.keywords || existingPost.tags || [],
      featuredImageUrl: existingPost.featured_image_url,
      featuredImageAlt: `${existingPost.title} - AI Coloring Page`,
      authorName: 'AI Coloring Page Team',
      publishDate: existingPost.created_at,
      modifiedDate: new Date().toISOString(),
      category: (existingPost.tags && existingPost.tags.length > 0) ? existingPost.tags[0] : 'Coloring Techniques',
      tags: existingPost.tags || [],
      coloringPageExamples: [],
      sections: extractSectionsFromContent(existingPost.content, primaryKeyword),
      faqs: generateFAQsForKeyword(primaryKeyword),
      conclusion: `<p>We hope you enjoyed this article about ${primaryKeyword}. Remember that coloring is not just a fun activity, but also a great way to relieve stress and express creativity. Regular practice can improve focus, patience, and artistic skills for both children and adults.</p>`,
      callToAction: `<p>Ready to try your hand at coloring? Use our AI Coloring Page Generator to create custom ${primaryKeyword} that match your interests! With just a few clicks, you can generate unique designs perfectly suited to your preferences.</p>`,
      relatedPosts: []
    };
    
    // Convert the template to database format
    return {
      content: convertSectionsToHTML(templatePost),
      meta_description: templatePost.metaDescription,
      seo_data: {
        primaryKeyword: templatePost.primaryKeyword,
        keywords: templatePost.secondaryKeywords,
        structuredData: generateStructuredData(templatePost)
      }
    };
  } catch (error) {
    console.error('Error in regenerateBlogPost:', error);
    throw error;
  }
}

/**
 * Extract keyword from title if not available elsewhere
 */
function extractKeywordFromTitle(title: string): string {
  // Common coloring page keywords to look for
  const keywords = [
    'mandala', 'animal', 'educational', 'mindfulness', 'holiday', 
    'seasonal', 'fantasy', 'characters', 'geometric', 'nature'
  ];
  
  const lowerTitle = title.toLowerCase();
  
  // Find the first matching keyword
  for (const keyword of keywords) {
    if (lowerTitle.includes(keyword)) {
      return `${keyword} coloring pages`;
    }
  }
  
  // Default if no match found
  return 'coloring pages';
}

/**
 * Extract sections from existing content
 */
function extractSectionsFromContent(content: string, primaryKeyword: string): Array<{heading: string, content: string}> {
  if (!content) {
    return generateDefaultSections(primaryKeyword);
  }

  // Try to extract sections based on h2 tags
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  let h2Matches = [];
  let match;
  
  // Find all h2 headings
  while ((match = h2Regex.exec(content)) !== null) {
    h2Matches.push({
      fullMatch: match[0],
      headingText: match[1],
      index: match.index
    });
  }
  
  if (h2Matches && h2Matches.length > 0) {
    // Get content between h2 tags
    const sections = [];
    for (let i = 0; i < h2Matches.length; i++) {
      const heading = h2Matches[i].headingText.replace(/<[^>]*>/g, ''); // Remove any HTML tags inside the heading
      let sectionContent;
      
      if (i < h2Matches.length - 1) {
        // Get content between this h2 and the next
        const startIdx = h2Matches[i].index + h2Matches[i].fullMatch.length;
        const endIdx = h2Matches[i+1].index;
        sectionContent = content.substring(startIdx, endIdx);
      } else {
        // Get content after the last h2
        const startIdx = h2Matches[i].index + h2Matches[i].fullMatch.length;
        sectionContent = content.substring(startIdx);
      }
      
      sections.push({
        heading,
        content: sectionContent
      });
    }
    return sections;
  } else {
    // If no h2 tags, create a single section with the content
    return [{
      heading: 'About ' + primaryKeyword,
      content: content
    }];
  }
}

/**
 * Generate default sections for a blog post
 */
function generateDefaultSections(keyword: string): Array<{heading: string, content: string}> {
  return [
    {
      heading: `What Are ${keyword}?`,
      content: `<p>${keyword} are specialized designs that offer unique benefits for artists of all skill levels. These pages feature distinctive patterns and elements that make them perfect for both educational purposes and creative expression.</p>
      <p>They're designed with careful attention to detail and accessibility, making them suitable for beginners and experienced colorists alike.</p>`
    },
    {
      heading: `Benefits of ${keyword}`,
      content: `<p>Regular coloring with ${keyword} has been shown to provide numerous benefits:</p>
      <ul>
        <li><strong>Enhanced Focus:</strong> The intricate patterns help improve concentration and attention span</li>
        <li><strong>Stress Reduction:</strong> The rhythmic nature of coloring helps activate the relaxation response</li>
        <li><strong>Fine Motor Skills:</strong> Precise coloring helps develop hand-eye coordination</li>
        <li><strong>Creative Expression:</strong> Choosing colors and techniques allows for personal artistic growth</li>
      </ul>
      <p>Research published in the Journal of Art Therapy has demonstrated that just 20 minutes of coloring can significantly reduce anxiety levels and promote a state of mindfulness.</p>`
    },
    {
      heading: `How to Choose the Right ${keyword}`,
      content: `<p>When selecting ${keyword}, consider the following factors:</p>
      <ol>
        <li><strong>Age Appropriateness:</strong> Match complexity to age and skill level</li>
        <li><strong>Interest Alignment:</strong> Choose themes that resonate with the colorist</li>
        <li><strong>Educational Value:</strong> Look for pages that teach new concepts</li>
        <li><strong>Print Quality:</strong> Ensure pages have clear lines and sufficient detail</li>
      </ol>
      <p>For beginners, start with simpler designs featuring larger spaces. As skills develop, gradually introduce more intricate patterns.</p>`
    }
  ];
}

/**
 * Generate FAQs for a specific keyword
 */
function generateFAQsForKeyword(keyword: string): Array<{question: string, answer: string}> {
  return [
    {
      question: `What are the benefits of ${keyword}?`,
      answer: `<p>${keyword} offer numerous benefits, including stress reduction, improved focus, enhanced fine motor skills, and creative expression. Regular coloring has been shown to help reduce anxiety and promote mindfulness.</p>`
    },
    {
      question: `How do I get started with ${keyword}?`,
      answer: `<p>Getting started with ${keyword} is easy! Simply download and print the designs you like, gather your favorite coloring supplies (colored pencils, markers, or crayons), and find a comfortable, well-lit space to begin. Start with simpler designs if you're a beginner.</p>`
    },
    {
      question: `Are ${keyword} suitable for all ages?`,
      answer: `<p>Yes, ${keyword} are designed for various skill levels. Simpler versions are perfect for children as young as 4-5 years old, while more complex designs challenge teenagers and adults. The key is selecting designs appropriate for the colorist's age and ability.</p>`
    }
  ];
} 