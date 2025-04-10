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
 * Generate a blog post using Gemini API
 * 
 * @param topic The topic for the blog post
 * @param targetLength The approximate target length in words
 * @returns Generated blog post content
 */
export async function generateBlogPost(topic: string, targetLength = 1200): Promise<{
  title: string;
  content: string;
  description: string;
}> {
  try {
    // During build, return a placeholder
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.log('Skipping blog post generation during build');
      return {
        title: `${topic} Coloring Pages - Fun & Educational Activities`,
        description: `Discover the joy of ${topic} coloring pages, perfect for kids of all ages. Download and print these free pages today!`,
        content: `<h1>${topic} Coloring Pages - Fun & Educational Activities</h1><p>This is placeholder content generated during build.</p>`
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `
          Create a comprehensive, SEO-optimized blog post about "${topic}" for our coloring pages website.
          
          CONTENT STRUCTURE REQUIREMENTS:
          1. CREATE A COMPELLING TITLE:
             - Include the primary keyword "${topic}" prominently
             - Make it engaging, between 50-60 characters
             - Format with proper title capitalization
          
          2. CREATE A META DESCRIPTION:
             - Summarize the content in exactly 150-160 characters
             - Include primary and secondary keywords naturally
             - Add a clear call-to-action
          
          3. WRITE A COMPREHENSIVE POST WITH THESE SECTIONS:
             - Introduction (engaging hook + why these coloring pages are beneficial)
             - Educational Benefits (with specific age-appropriate learning outcomes)
             - Creative Activities and Ideas (practical applications)
             - Developmental Benefits (cognitive, motor skills, emotional benefits)
             - Interesting Facts or History (about the topic)
             - Coloring Techniques or Tips (specific to the theme)
             - Conclusion with call-to-action to download our coloring pages
          
          SEO OPTIMIZATION REQUIREMENTS:
          - Use proper HTML formatting with h1, h2, h3 heading hierarchy
          - Include the primary keyword in the first 100 words
          - Add 3-5 related keywords naturally throughout the text
          - Create bulleted or numbered lists for better readability
          - Keep paragraphs short (3-5 sentences maximum)
          - Include a strong call-to-action in the conclusion
          - Total word count: ${targetLength}-${targetLength+200} words
          
          TARGET AUDIENCE: Parents and educators looking for educational, fun activities for children
          
          CONTENT QUALITY GUIDELINES:
          - Write in a conversational, engaging tone
          - Use active voice and present tense where possible
          - Include practical, actionable advice
          - Make content comprehensive and valuable to readers
          - Avoid generic filler text or fluff
          
          Format your response exactly as follows:
          TITLE: [Your title here]
          META-DESCRIPTION: [Your meta description here]
          CONTENT: [The full blog post with proper HTML formatting]
        `,
        temperature: 0.7,
        maxTokens: Math.max(4096, targetLength * 3), // Increased token limit for quality content
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error generating blog post:', errorData);
      throw new Error('Failed to generate blog post');
    }
    
    const data = await response.json();
    const generatedText = data.text.trim();
    
    // Parse the generated text to extract title, description, and content
    const titleMatch = generatedText.match(/TITLE:\s*(.*?)(?=META-DESCRIPTION:|$)/m);
    const descriptionMatch = generatedText.match(/META-DESCRIPTION:\s*(.*?)(?=CONTENT:|$)/m);
    const contentMatch = generatedText.match(/CONTENT:\s*([\s\S]*?)$/);
    
    return {
      title: (titleMatch?.[1] || topic).trim(),
      description: (descriptionMatch?.[1] || '').trim(),
      content: (contentMatch?.[1] || generatedText).trim()
    };
  } catch (error) {
    console.error('Exception generating blog post:', error);
    throw error;
  }
} 