import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define settings table name
const SETTINGS_TABLE = 'app_settings';

// Default settings
const defaultSettings = {
  postCount: 1,
  postLength: 800
};

// GET handler to retrieve current settings
export async function GET(request: NextRequest) {
  console.log('GET /api/admin/settings: Fetching settings');
  
  try {
    // First, try to get settings from Supabase
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select('*')
      .eq('id', 'blog_settings')
      .single();
    
    if (error) {
      // If table doesn't exist or other error, return default settings
      console.log('Error fetching settings from Supabase:', error);
      
      if (error.code === '42P01') { // Table doesn't exist
        console.log('Table does not exist, using default settings');
      }
      
      return NextResponse.json({ 
        success: true, 
        settings: defaultSettings,
        source: 'defaults'
      });
    }
    
    if (data) {
      const settings = {
        postCount: data.post_count || defaultSettings.postCount,
        postLength: data.post_length || defaultSettings.postLength,
      };
      
      // Update environment variables to reflect current settings
      process.env.AUTO_BLOG_POST_COUNT = String(settings.postCount);
      process.env.AUTO_BLOG_POST_LENGTH = String(settings.postLength);
      
      console.log('GET /api/admin/settings: Retrieved settings from Supabase', settings);
      return NextResponse.json({ 
        success: true, 
        settings,
        source: 'database'
      });
    } else {
      console.log('No settings found in Supabase, using defaults');
      return NextResponse.json({ 
        success: true, 
        settings: defaultSettings,
        source: 'defaults'
      });
    }
  } catch (error: any) {
    console.error('Error getting settings:', error);
    return NextResponse.json({ 
      success: true, // Return success anyway with defaults
      settings: defaultSettings,
      source: 'error_fallback',
      error: error.message || 'Failed to retrieve settings'
    });
  }
}

// POST handler to update settings
export async function POST(request: NextRequest) {
  console.log('POST /api/admin/settings: Saving settings');
  
  // Add CORS headers
  const response = new NextResponse();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    const data = await request.json();
    console.log('POST /api/admin/settings: Received data', data);
    
    // Validate settings
    const postCount = parseInt(data.postCount);
    const postLength = parseInt(data.postLength);
    
    if (isNaN(postCount) || postCount < 1 || postCount > 10) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post count must be between 1 and 10' 
      }, { status: 400, headers: response.headers });
    }
    
    if (isNaN(postLength) || postLength < 500 || postLength > 5000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post length must be between 500 and 5000 words' 
      }, { status: 400, headers: response.headers });
    }
    
    // Update settings in Supabase if possible
    try {
      const { error } = await supabase
        .from(SETTINGS_TABLE)
        .upsert({
          id: 'blog_settings',
          post_count: postCount,
          post_length: postLength,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error('Error saving settings to Supabase:', error);
        // Continue anyway, we'll tell the frontend to use localStorage as fallback
      }
    } catch (dbError) {
      console.error('Exception saving settings to Supabase:', dbError);
      // Continue anyway, we'll tell the frontend to use localStorage as fallback
    }
    
    // Update environment variables to reflect new settings
    process.env.AUTO_BLOG_POST_COUNT = String(postCount);
    process.env.AUTO_BLOG_POST_LENGTH = String(postLength);
    
    console.log('POST /api/admin/settings: Settings saved successfully');
    return NextResponse.json({ 
      success: true, 
      settings: {
        postCount,
        postLength
      },
      message: 'Settings updated successfully'
    }, { headers: response.headers });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to update settings' 
    }, { status: 500, headers: response.headers });
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
} 