import { createClient } from '@supabase/supabase-js';

// These values should be set in your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export interface ImageRecord {
  id: string;
  created_at: string;
  prompt: string;
  image_url: string;
  is_public: boolean;
  user_id?: string;
  style?: string;
  title?: string;
  updated_at: string;
  // SEO Fields
  alt_text?: string;
  seo_description?: string;
  seo_filename?: string;
  caption?: string;
  keywords?: string[];
}

// Define the interface for gallery image options
export interface GalleryImageOptions {
  page?: number;
  limit?: number;
  category?: string;
  style?: string;
}

// Helper functions for working with images
export async function saveImageToGallery(prompt: string, imageUrl: string, style?: string, title?: string) {
  try {
    console.log('Supabase: Attempting to save image to gallery', {
      promptLength: prompt?.length,
      imageUrlStartsWith: imageUrl?.substring(0, 30),
      style,
      hasTitle: !!title
    });
    
    if (!prompt || !imageUrl) {
      console.error('Supabase: Invalid parameters for saveImageToGallery', {
        hasPrompt: !!prompt,
        hasImageUrl: !!imageUrl
      });
      return null;
    }
    
    console.log('Supabase: Using URL', supabaseUrl);
    console.log('Supabase: Has Anon Key', !!supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('images')
      .insert([
        { 
          prompt, 
          image_url: imageUrl,
          is_public: true,
          style,
          title: title || prompt.substring(0, 100) // Use the first 100 characters of the prompt if no title is provided
        },
      ]);
      
    if (error) {
      console.error('Supabase: Error saving image to gallery:', error);
      console.error('Supabase: Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }
    
    console.log('Supabase: Successfully saved image to gallery, data:', data);
    return data;
  } catch (err) {
    console.error('Supabase: Exception saving image to gallery:', err);
    if (err instanceof Error) {
      console.error('Supabase: Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    }
    return null;
  }
}

// Update getGalleryImages to handle missing status field
export async function getGalleryImages(options: GalleryImageOptions = {}): Promise<ImageRecord[]> {
  try {
    const { page = 1, limit = 12, category, style } = options;
    const offset = (page - 1) * limit;
    
    console.log(`Getting gallery images with options:`, { page, limit, offset, category, style });
    
    // Build the query
    let query = supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Add filters if provided
    // We check for 'status' field or fallback to 'is_public' for backwards compatibility
    // with older database schemas
    try {
      // First try to get one record to check schema
      const { data: sampleData } = await supabase
        .from('images')
        .select('status, is_public')
        .limit(1);
      
      if (sampleData && sampleData.length > 0) {
        const record = sampleData[0];
        
        // Check which field exists in the schema
        if ('status' in record) {
          console.log('Using status field for filtering published images');
          query = query.eq('status', 'published');
        } else if ('is_public' in record) {
          console.log('Using is_public field for filtering published images');
          query = query.eq('is_public', true);
        } else {
          console.log('No publishing status field found, returning all images');
        }
      }
    } catch (error) {
      console.error('Error checking schema:', error);
      // Default to including all images if we can't determine schema
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (style) {
      query = query.eq('style', style);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching gallery images:', error);
      throw new Error(`Failed to fetch gallery images: ${error.message}`);
    }
    
    return data as ImageRecord[];
  } catch (error) {
    console.error('Error in getGalleryImages:', error);
    throw error;
  }
}

export async function getImageById(id: string): Promise<ImageRecord | null> {
  try {
    console.log(`Supabase: Fetching image with ID: ${id}`);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase: Missing configuration - URL or Anon Key is empty');
      return null;
    }
    
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Supabase: Error fetching image with ID ${id}:`, error);
      console.error('Supabase: Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }
    
    if (!data) {
      console.log(`Supabase: No image found with ID: ${id}`);
      return null;
    }
    
    console.log(`Supabase: Successfully fetched image with ID: ${id}`);
    return data as ImageRecord;
  } catch (err) {
    console.error(`Supabase: Exception fetching image with ID ${id}:`, err);
    if (err instanceof Error) {
      console.error('Supabase: Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    }
    return null;
  }
}

export async function getRelatedImages(id: string, limit = 4): Promise<ImageRecord[]> {
  try {
    console.log(`Supabase: Fetching related images for ID: ${id}, limit: ${limit}`);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase: Missing configuration - URL or Anon Key is empty');
      return [];
    }
    
    // In a real application, you would use a more sophisticated algorithm
    // to find related images based on tags, similarity, etc.
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .neq('id', id) // Don't include the current image
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error(`Supabase: Error fetching related images for ID ${id}:`, error);
      console.error('Supabase: Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return [];
    }
    
    console.log(`Supabase: Successfully fetched ${data?.length || 0} related images for ID: ${id}`);
    return data as ImageRecord[];
  } catch (err) {
    console.error(`Supabase: Exception fetching related images for ID ${id}:`, err);
    if (err instanceof Error) {
      console.error('Supabase: Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    }
    return [];
  }
} 