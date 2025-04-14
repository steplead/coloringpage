import { NextRequest, NextResponse } from 'next/server';

// Add function to validate blog content and filter out generic patterns
function validateAndCleanContent(content: string, imageDetails: any): string {
  // Patterns to detect and remove (with whole sentences/paragraphs)
  const bannedPatterns = [
    /<p>\s*Welcome to our guide on coloring pages[^<]*<\/p>/gi,
    /<p>\s*coloring pages feature distinctive patterns[^<]*<\/p>/gi,
    /<p>\s*"?I've been using these coloring pages[^<]*<\/p>/gi,
    /<h2[^>]*>\s*About\s+coloring\s+pages\s*<\/h2>/gi,
    /<p>\s*coloring pages are specialized designs that offer unique benefits[^<]*<\/p>/gi,
    /<div[^>]*>\s*<h2[^>]*>\s*Frequently Asked Questions\s*<\/h2>/gi,
    /<blockquote[^>]*>.*?<\/blockquote>/gis,
    /<div[^>]*class="[^"]*testimonial[^"]*"[^>]*>.*?<\/div>/gis
  ];
  
  // Remove any banned patterns
  let cleanedContent = content;
  bannedPatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });
  
  // Replace single-line generic phrases that might break coherence after removal
  const phrasesToReplace = [
    { pattern: /Welcome to our guide on coloring pages\./g, replacement: '' },
    { pattern: /I've been using these coloring pages/g, replacement: '' },
    { pattern: /offer unique benefits for artists of all skill levels/g, replacement: 'are designed for everyone' },
    { pattern: /designed with careful attention to detail and accessibility/g, replacement: 'designed thoughtfully' },
    { pattern: /coloring pages feature distinctive patterns/g, replacement: 'This particular coloring page features' }
  ];
  
  phrasesToReplace.forEach(({ pattern, replacement }) => {
    cleanedContent = cleanedContent.replace(pattern, replacement);
  });
  
  // Check for the presence of image-specific content
  const requiredImageSpecificContent = [
    `${imageDetails.title}`,
    'specific',
    'unique',
    'this image',
    'this design',
    'this coloring page'
  ];
  
  // Count how many required elements are present
  const contentSpecificity = requiredImageSpecificContent.filter(phrase => 
    cleanedContent.toLowerCase().includes(phrase.toLowerCase())
  ).length;
  
  console.log(`Content specificity score: ${contentSpecificity}/${requiredImageSpecificContent.length}`);
  
  // Add image-specific opener if missing
  if (!cleanedContent.includes(imageDetails.title) && !cleanedContent.match(/<h1|<h2/i)) {
    cleanedContent = `<h1>Detailed Guide to the ${imageDetails.title} Coloring Page</h1>\n${cleanedContent}`;
  }
  
  // Ensure the content starts with image-specific description
  if (!cleanedContent.match(/<figure|<img/i)) {
    cleanedContent = `<figure class="featured-image">
      <img src="${imageDetails.image_url}" alt="${imageDetails.title || 'Coloring page'}" className="w-full h-auto rounded-lg" />
      <figcaption>${imageDetails.caption || imageDetails.title || 'Detailed coloring page'}</figcaption>
    </figure>\n${cleanedContent}`;
  }
  
  // Add image-specific introduction if the content is now too short
  if (cleanedContent.length < 500) {
    const specificIntro = `<p>This ${imageDetails.title} coloring page features intricate details that make it perfect for both beginners and experienced colorists. The design includes unique elements that allow for creative expression through various coloring techniques.</p>`;
    cleanedContent = cleanedContent.replace(/<figure[^>]*>.*?<\/figure>/s, `$&\n${specificIntro}`);
  }
  
  return cleanedContent;
}

/**
 * Test endpoint to check content cleaning functionality
 */
export async function POST(request: NextRequest) {
  try {
    const { content, imageDetails } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    const testImageDetails = imageDetails || {
      title: 'Test Image',
      image_url: 'https://example.com/test.jpg',
      caption: 'Test Caption'
    };
    
    // Clean the content
    const cleanedContent = validateAndCleanContent(content, testImageDetails);
    
    // Return original and cleaned content for comparison
    return NextResponse.json({
      original: {
        length: content.length,
        content: content.substring(0, 200) + '...' // Show first 200 chars for preview
      },
      cleaned: {
        length: cleanedContent.length,
        content: cleanedContent.substring(0, 200) + '...' // Show first 200 chars for preview
      },
      fullCleanedContent: cleanedContent
    });
    
  } catch (error) {
    console.error('Error in content cleaning test:', error);
    return NextResponse.json(
      { error: 'Failed to process content' },
      { status: 500 }
    );
  }
} 