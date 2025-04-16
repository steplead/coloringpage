/**
 * Gemini API helper functions
 * 
 * This library provides helper functions for interacting with Google Gemini API
 */

// Get the base URL for API calls, defaulting to localhost in development
const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Generate optimized prompts for image generation using Gemini
 * 
 * @param userPrompt The original user-provided prompt
 * @returns An optimized prompt for better image generation
 */
export async function generateOptimizedPrompt(userPrompt: string): Promise<string> {
  try {
    // During build, return the original prompt to avoid API calls
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.log('Skipping API call during build');
      return userPrompt;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `
          I want you to help improve this prompt for an AI coloring page generator. 
          Convert the following basic prompt into a more detailed and specific one 
          that will create a good black and white line drawing suitable for coloring.
          
          Add descriptive details about the subject, specify "black and white line drawing",
          "clean outlines", "suitable for printing", and ensure it's family-friendly.
          
          Keep the result concise (under 100 words) but effective for generating a good 
          coloring page.
          
          Original prompt: "${userPrompt}"
          
          Improved prompt:
        `,
        temperature: 0.7,
        maxTokens: 200,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error optimizing prompt:', errorData);
      return userPrompt; // Return original prompt on error
    }
    
    const data = await response.json();
    return data.text.trim() || userPrompt;
  } catch (error) {
    console.error('Exception optimizing prompt:', error);
    return userPrompt; // Return original prompt on exception
  }
}

/**
 * Clean generated content to remove generic or templated sections
 * @param content The raw generated content
 * @returns Cleaned content with generic sections removed
 */
export function cleanContent(content: string): string {
  let cleaned = content;
  
  // Remove generic introduction sections
  cleaned = cleaned
    .replace(/^\s*Welcome to our guide on coloring pages[\s\S]*?(?=\n\n)/gim, '')
    .replace(/^\s*Welcome\s[\s\S]*?(?=\n\n)/gim, '')
    .replace(/^In this guide,?\s[\s\S]*?(?=\n\n)/gim, '')
    .replace(/^In this article,?\s[\s\S]*?(?=\n\n)/gim, '')
    .replace(/Welcome to our [\s\S]*? coloring[\s\S]*?(?=\n\n)/gim, '')
    .replace(/This article will provide you with[\s\S]*?(?=\n\n)/gim, '');
  
  // Remove testimonials
  cleaned = cleaned
    .replace(/[""].*(?:love|enjoy|use).*coloring pages.*[""].*[-—].*\w+.*\n?/gi, '')
    .replace(/.*testimonial.*\n?/gi, '')
    .replace(/[""]I've been using these coloring pages[\s\S]*?(?=\n\n)/gim, '')
    .replace(/[""][^"]*classroom[^"]*[""].*[-—].*\w+.*\n?/gi, '')
    .replace(/[""][^"]*students[^"]*[""].*[-—].*\w+.*\n?/gi, '')
    .replace(/[""][^"]*teacher[^"]*[""].*[-—].*\w+.*\n?/gi, '');
  
  // Remove "About coloring pages" sections
  cleaned = cleaned
    .replace(/#+\s*About coloring pages[\s\S]*?(?=#+|$)/gim, '')
    .replace(/coloring pages are specialized designs[\s\S]*?(?=\n\n)/gim, '')
    .replace(/About coloring pages[\s\S]*?(?=\n\n)/gim, '')
    .replace(/coloring pages feature distinctive patterns[\s\S]*?(?=\n\n)/gim, '')
    .replace(/These pages feature distinctive patterns[\s\S]*?(?=\n\n)/gim, '')
    .replace(/They're designed with careful attention[\s\S]*?(?=\n\n)/gim, '')
    .replace(/making them suitable for beginners[\s\S]*?(?=\n\n)/gim, '');
  
  // Remove FAQ sections
  cleaned = cleaned
    .replace(/#+\s*Frequently Asked Questions[\s\S]*?(?=#+|$)/gim, '')
    .replace(/#+\s*FAQs[\s\S]*?(?=#+|$)/gim, '')
    .replace(/#+\s*Common Questions[\s\S]*?(?=#+|$)/gim, '')
    .replace(/Q:\s*.*\n?A:\s*.*(?=\n\n)/gim, '');

  // Remove general benefits sections
  cleaned = cleaned
    .replace(/#+\s*Benefits of Coloring[\s\S]*?(?=#+|$)/gim, '')
    .replace(/#+\s*Why Coloring is Important[\s\S]*?(?=#+|$)/gim, '')
    .replace(/#+\s*Educational Benefits[\s\S]*?(?=#+|$)/gim, '')
    .replace(/The benefits of coloring include[\s\S]*?(?=\n\n)/gim, '')
    .replace(/Coloring offers numerous benefits[\s\S]*?(?=\n\n)/gim, '')
    .replace(/Studies have shown that coloring[\s\S]*?(?=\n\n)/gim, '');
  
  // Remove marketing language
  cleaned = cleaned
    .replace(/visit our website[\s\S]*?(?=\n)/gim, '')
    .replace(/check out our collection[\s\S]*?(?=\n)/gim, '')
    .replace(/explore our gallery[\s\S]*?(?=\n)/gim, '')
    .replace(/visit our site[\s\S]*?(?=\n)/gim, '')
    .replace(/on our website[\s\S]*?(?=\n)/gim, '')
    .replace(/our collection of coloring pages[\s\S]*?(?=\n)/gim, '')
    .replace(/check out our other[\s\S]*?(?=\n)/gim, '')
    .replace(/thank you for visiting[\s\S]*?(?=\n)/gim, '');
  
  // Multiple blank lines to double newline
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // If we accidentally removed the beginning of the content, ensure we start with a heading
  if (!cleaned.trim().startsWith('#')) {
    // Find the first heading
    const firstHeadingMatch = cleaned.match(/^#.*$/m);
    if (firstHeadingMatch) {
      // Get everything from the first heading onwards
      cleaned = cleaned.substring(cleaned.indexOf(firstHeadingMatch[0]));
    }
  }
  
  return cleaned.trim();
}

/**
 * Generate a blog post using Gemini API based on a specific image
 * 
 * @param topic The topic for the blog post
 * @param targetLength The approximate target length in words
 * @param imageDetails Details about the specific image to focus on
 * @returns Generated blog post content
 */
export async function generateBlogPost(
  topic: string, 
  targetLength = 1500, 
  imageDetails?: {
    imageUrl: string;
    title: string;
    description: string;
    keywords: string[];
    prompt: string;
    id: string;
  }
): Promise<{
  title: string;
  content: string;
  description: string;
} | null> {
  try {
    // During build, return null to prevent insertion
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.log('Skipping blog post generation during build, returning null.');
      return null;
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = process.env.GEMINI_API_URL;
    const MODEL = process.env.GEMINI_MODEL;

    if (!API_KEY || !API_URL || !MODEL) {
      throw new Error('Missing required Gemini API configuration');
    }

    // Construct the prompt
    const prompt = `Create a detailed blog post about "${topic}" with the following requirements:
1. Focus EXCLUSIVELY on the specific image and its coloring techniques - no generic content whatsoever
2. DO NOT include ANY of the following:
   - Generic introductions or "Welcome to" sections
   - Testimonials or quotes from users
   - "About coloring pages" paragraphs
   - FAQ sections
   - General information about coloring benefits
   - Marketing language like "visit our website" or "our collection"
   - Any content that could apply to ANY coloring page
   - ANY mention of "our website", "our collection", or similar phrases
3. Start directly with a relevant H1 heading followed by the image description
4. Provide SPECIFIC, actionable coloring tips and techniques that are UNIQUE to this particular image
5. Include detailed step-by-step instructions for coloring THIS SPECIFIC image
6. Target length: ${targetLength} words
7. Format the content in Markdown
8. Make repeated references to the specific elements and features of THIS image

${imageDetails ? `Image Details (MUST be incorporated throughout the post):
- Title: ${imageDetails.title}
- Description: ${imageDetails.description}
- Keywords: ${imageDetails.keywords.join(', ')}
- Prompt: ${imageDetails.prompt}` : ''}

The blog post MUST be structured as follows:
1. H1 Title (specific to this image)
2. Image Description (detailed analysis of THIS SPECIFIC image's unique features)
3. Coloring Techniques (specific techniques relevant ONLY to this image)
4. Step-by-Step Guide (tailored exactly to this image's elements)
5. Tips and Tricks (specific to this image)
6. Final Thoughts (focused on this specific image)

CRUCIAL: The entire blog post must be about THIS SPECIFIC image. Do not include any general information that could apply to any coloring page. Every paragraph must directly reference unique elements of this specific image. NO GENERIC CONTENT WHATSOEVER.`;

    try {
      // Attempt to make the API request with a reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout (increased from 15s)
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Clean the generated content
      const cleanedContent = cleanContent(generatedText);

      // Extract title and description
      const titleMatch = cleanedContent.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : topic;
      
      const descriptionMatch = cleanedContent.match(/^##\s+Image Description\n\n([\s\S]+?)(?=\n\n##|$)/m);
      const description = descriptionMatch ? descriptionMatch[1].trim() : '';

      return {
        title,
        content: cleanedContent,
        description
      };
    } catch (apiError) {
      // Log the API error
      console.error('Gemini API error:', apiError);
      
      // Fall back to locally generated content
      console.log('Falling back to locally generated content for:', topic);
      
      // Create a markdown blog post focused on the specific image
      const title = imageDetails ? 
        `${imageDetails.title || topic} - Detailed Coloring Guide` : 
        `${topic} Coloring Page - Creative Guide`;
      
      let content = `# ${title}\n\n`;
      
      // Image description - highly specific to the image
      content += `## Image Description\n\n`;
      if (imageDetails) {
        content += `This detailed ${imageDetails.prompt || topic} coloring page offers a unique artistic experience with its carefully crafted outline design. `;
        content += `The image showcases ${imageDetails.keywords.slice(0, 3).join(', ')} elements with precision and creative flair. `;
        content += `Notice how the ${imageDetails.prompt.split(' ').slice(0, 3).join(' ')} creates a focal point, drawing your eye to the central design. `;
        content += `The balanced composition includes both detailed areas that require precision and open spaces for creative expression.\n\n`;
      } else {
        content += `This detailed ${topic} coloring page presents a unique artistic opportunity with its custom design. `;
        content += `The illustration balances detailed linework with open areas, perfect for practicing different coloring techniques.\n\n`;
      }
      
      // Coloring techniques - specifically reference image elements
      content += `## Coloring Techniques for This ${imageDetails?.prompt || topic}\n\n`;
      content += `When approaching this particular ${imageDetails?.title || topic} design, consider these specific techniques:\n\n`;
      
      // Use image-specific keywords to create technique suggestions
      const keywords = imageDetails?.keywords || [topic, 'detail', 'art'];
      const techniques = [
        `**${keywords[0]} Gradient** - Create depth in the ${keywords[0]} areas by gradually transitioning between related color shades`,
        `**${keywords.length > 1 ? keywords[1] : 'Pattern'} Texturing** - Add unique textures to the ${keywords.length > 1 ? keywords[1] : 'main'} elements using small repetitive patterns`,
        `**Focal Point Enhancement** - Make the central ${imageDetails?.prompt.split(' ')[0] || topic} element stand out with vibrant colors`,
        `**Background Contrast** - Use complementary colors between the ${imageDetails?.prompt.split(' ').slice(-1)[0] || 'background'} and foreground elements`
      ];
      
      content += techniques.join('\n') + '\n\n';
      
      // Step-by-step guide - with specific reference to image elements
      content += `## Step-by-Step Coloring Guide for This Design\n\n`;
      content += `Follow this process specifically designed for this ${imageDetails?.title || topic} illustration:\n\n`;
      
      // Create steps based on image metadata
      const promptParts = (imageDetails?.prompt || topic).split(' ').filter(word => word.length > 3);
      const steps = [
        `1. **Start with the ${promptParts[0] || 'main'} element** - Begin by applying a light base color to the ${promptParts[0] || 'central'} area`,
        `2. **Build depth in the ${promptParts.length > 1 ? promptParts[1] : 'secondary'} areas** - Add a slightly darker shade to create dimension`,
        `3. **Detail the ${promptParts.length > 2 ? promptParts[2] : 'intricate'} sections** - Use fine-tipped tools for the detailed linework in these areas`,
        `4. **Address the ${keywords.length > 2 ? keywords[2] : 'background'}** - Color the surrounding elements with complementary tones`,
        `5. **Add highlights and shadows** - Create dimension by adding strategic shading, especially around the ${promptParts[0] || 'main'} feature`,
        `6. **Final accents** - Add small pops of contrasting color to draw attention to key details in the design`
      ];
      
      content += steps.join('\n') + '\n\n';
      
      // Tips and tricks - image-specific
      content += `## Tips Specific to This ${imageDetails?.title || topic} Design\n\n`;
      content += `* The ${promptParts[0] || 'main'} section works particularly well with ${['warm', 'cool', 'complementary', 'analogous'][Math.floor(Math.random() * 4)]} colors\n`;
      content += `* Notice how the ${keywords[0]} areas have varying line densities - adjust your coloring pressure accordingly\n`;
      content += `* The ${promptParts.length > 1 ? promptParts[1] : 'detailed'} sections benefit from using fine-tipped markers or pencils\n`;
      content += `* Consider leaving some small white spaces around the ${keywords.length > 1 ? keywords[1] : 'intricate'} elements for highlighting\n`;
      content += `* Take breaks while working on the ${promptParts.length > 2 ? promptParts[2] : 'complex'} areas to maintain precision\n\n`;
      
      // Final thoughts - specific to this image
      content += `## Final Thoughts on This ${imageDetails?.title || topic} Coloring Page\n\n`;
      content += `This ${imageDetails?.title || topic} coloring page offers a unique opportunity to explore various coloring techniques within a single design. The balance between the ${promptParts[0] || 'main'} elements and the ${keywords.length > 2 ? keywords[2] : 'supporting'} details creates an engaging coloring experience. As you complete this specific illustration, pay attention to how your color choices enhance the ${promptParts.length > 1 ? promptParts[1] : 'overall'} composition. This particular design allows for both systematic color application and creative expression.`;
      
      // Clean any potential unwanted content
      const cleanedContent = cleanContent(content);
      
      return {
        title,
        content: cleanedContent,
        description: `Explore detailed techniques for coloring this unique ${imageDetails?.title || topic} design. Learn step-by-step approaches, color suggestions, and expert tips specific to this illustration.`
      };
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
    
    // Final fallback with minimal content
    const title = `${topic} Coloring Page Guide`;
    const content = `# ${topic} Coloring Page Guide\n\n## Image Description\n\nThis ${topic} coloring page features clean outlines and artistic detail perfect for coloring enthusiasts of all ages.\n\n## Coloring Techniques\n\n* Use colored pencils for detailed areas\n* Try markers for bold sections\n* Experiment with blending for unique effects\n\n## Step-by-Step Guide\n\n1. Start with lighter colors\n2. Add darker shades for depth\n3. Finish with highlights and details`;
    
    return {
      title,
      content,
      description: `A simple guide to coloring this ${topic} design with techniques and step-by-step instructions.`
    };
  }
} 