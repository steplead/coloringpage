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
export async function generateBlogPost(topic: string, targetLength = 1000): Promise<{
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
          Write a comprehensive blog post about ${topic} coloring pages.
          
          The blog post should include:
          1. An engaging title with the keyword "${topic} coloring pages"
          2. An introduction explaining why ${topic} coloring pages are popular and beneficial
          3. A section on educational benefits of coloring this theme
          4. Creative ideas for using these coloring pages
          5. A brief history or fun facts about the ${topic} theme
          6. Tips for coloring techniques appropriate for this theme
          7. A conclusion encouraging readers to download and try our coloring pages
          
          Format the post with clear HTML headings (h1, h2, h3) and paragraphs.
          Include 2-3 keyword-rich subheadings.
          Optimize the content for SEO while maintaining a natural, engaging tone.
          Target audience: parents and teachers looking for educational coloring activities.
          Word count: around ${targetLength} words.
          
          Also provide a short meta description (under 160 characters) for SEO purposes.
          
          Structure your response as:
          TITLE: [Your title here]
          META-DESCRIPTION: [Your meta description here]
          CONTENT: [The full blog post content with HTML formatting]
        `,
        temperature: 0.7,
        maxTokens: Math.max(2048, targetLength * 2), // Ensure token limit is sufficient
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
    const titleMatch = generatedText.match(/TITLE:\s*(.*?)(?=META-DESCRIPTION:|$)/);
    const descriptionMatch = generatedText.match(/META-DESCRIPTION:\s*(.*?)(?=CONTENT:|$)/);
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