import { supabase } from '@/lib/supabase';

/**
 * Interface for coloring page data
 */
export interface ColoringPage {
  id: string;
  image_url: string;
  title?: string;
  alt_text?: string;
  seo_description?: string;
  caption?: string;
  keywords?: string[];
  prompt?: string;
  created_at?: string;
  updated_at?: string;
  seo_filename?: string;
}

/**
 * Get coloring page by ID
 */
export async function getColoringPageById(id: string): Promise<ColoringPage | null> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching coloring page:', error);
      return null;
    }
    
    return data as ColoringPage;
  } catch (err) {
    console.error('Exception fetching coloring page:', err);
    return null;
  }
}

/**
 * Get recent coloring pages
 */
export async function getRecentColoringPages(limit = 12): Promise<ColoringPage[]> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent coloring pages:', error);
      return [];
    }
    
    return data as ColoringPage[];
  } catch (err) {
    console.error('Exception fetching recent coloring pages:', err);
    return [];
  }
}

/**
 * Get coloring pages by keyword
 */
export async function getColoringPagesByKeyword(keyword: string, limit = 12): Promise<ColoringPage[]> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .contains('keywords', [keyword])
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching coloring pages by keyword:', error);
      return [];
    }
    
    return data as ColoringPage[];
  } catch (err) {
    console.error('Exception fetching coloring pages by keyword:', err);
    return [];
  }
}

/**
 * Search coloring pages
 */
export async function searchColoringPages(query: string, limit = 20): Promise<ColoringPage[]> {
  try {
    // Search in title, prompt, keywords, etc.
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .or(`title.ilike.%${query}%,prompt.ilike.%${query}%,seo_description.ilike.%${query}%,alt_text.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error searching coloring pages:', error);
      return [];
    }
    
    return data as ColoringPage[];
  } catch (err) {
    console.error('Exception searching coloring pages:', err);
    return [];
  }
}

/**
 * Get random coloring pages
 */
export async function getRandomColoringPages(limit = 6): Promise<ColoringPage[]> {
  try {
    // Supabase doesn't have a direct random() function in the query builder
    // So we'll get a bunch of images and then shuffle them
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .limit(limit * 3); // Get more than we need so we can shuffle
    
    if (error) {
      console.error('Error fetching random coloring pages:', error);
      return [];
    }
    
    // Shuffle the array and slice to the requested limit
    const shuffled = (data as ColoringPage[]).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (err) {
    console.error('Exception fetching random coloring pages:', err);
    return [];
  }
} 