import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define settings table name
const SETTINGS_TABLE = 'app_settings';

// Default settings including the new toggle
const defaultSettings = {
  postCount: 1,
  postLength: 800,
  autoBlogEnabled: true // Default to enabled
};

// GET handler to retrieve current settings
export async function GET() {
  console.log('GET /api/admin/settings: Fetching settings');
  
  try {
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select('*')
      .eq('id', 'blog_settings') // Use a specific ID for the blog settings row
      .single();
    
    if (error || !data) {
      if (error && error.code !== 'PGRST116') { // PGRST116 = Row not found
         console.error('Error fetching settings from Supabase:', error?.message);
      }
      // If row doesn't exist or other error, return default settings
      console.log('No settings found in DB or error occurred, returning defaults.');
      return NextResponse.json({ 
        success: true, 
        settings: defaultSettings,
        source: 'defaults'
      });
    }
    
    // Map DB columns to settings object keys
    const settings = {
      postCount: data.post_count ?? defaultSettings.postCount,
      postLength: data.post_length ?? defaultSettings.postLength,
      autoBlogEnabled: data.auto_blog_enabled ?? defaultSettings.autoBlogEnabled // Fetch enabled status
    };
    
    // Update environment variables (consider if this is still needed or safe)
    // If multiple instances run, this might cause inconsistency
    // process.env.AUTO_BLOG_POST_COUNT = String(settings.postCount);
    // process.env.AUTO_BLOG_POST_LENGTH = String(settings.postLength);
    
    console.log('GET /api/admin/settings: Retrieved settings from Supabase', settings);
    return NextResponse.json({ 
      success: true, 
      settings,
      source: 'database'
    });

  } catch (error: unknown) {
    console.error('Error getting settings:', error);
    return NextResponse.json({ 
      success: true, // Return success anyway with defaults
      settings: defaultSettings,
      source: 'error_fallback',
      error: error instanceof Error ? error.message : 'Failed to retrieve settings'
    });
  }
}

// POST handler to update settings
export async function POST(request: NextRequest) {
  console.log('POST /api/admin/settings: Saving settings');
  
  try {
    const body = await request.json();
    console.log('POST /api/admin/settings: Received data', body);
    
    // Validate settings
    const postCount = parseInt(body.postCount);
    const postLength = parseInt(body.postLength);
    // Get the boolean value for autoBlogEnabled, default to true if missing/invalid
    const autoBlogEnabled = typeof body.autoBlogEnabled === 'boolean' ? body.autoBlogEnabled : true;
    
    // Basic validation (adjust ranges as needed)
    if (isNaN(postCount) || postCount < 1 || postCount > 10) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post count must be between 1 and 10' 
      }, { status: 400 });
    }
    if (isNaN(postLength) || postLength < 500 || postLength > 5000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post length must be between 500 and 5000 words' 
      }, { status: 400 });
    }
    
    // Prepare data for Supabase (use snake_case for column names)
    const settingsToSave = {
      id: 'blog_settings', // Specific ID for the settings row
      post_count: postCount,
      post_length: postLength,
      auto_blog_enabled: autoBlogEnabled, // Save the enabled status
      updated_at: new Date().toISOString()
    };

    // Update settings in Supabase using upsert
    const { error: dbError } = await supabase
      .from(SETTINGS_TABLE)
      .upsert(settingsToSave, { onConflict: 'id' }); // Upsert based on the ID
    
    if (dbError) {
      console.error('Error saving settings to Supabase:', dbError);
      // Return an error response if DB save fails
       return NextResponse.json({ 
        success: false, 
        error: `Failed to save settings to database: ${dbError.message}` 
      }, { status: 500 });
    }
    
    // Update environment variables (still consider removing this)
    // process.env.AUTO_BLOG_POST_COUNT = String(postCount);
    // process.env.AUTO_BLOG_POST_LENGTH = String(postLength);
    
    console.log('POST /api/admin/settings: Settings saved successfully to DB');
    return NextResponse.json({ 
      success: true, 
      settings: { // Return camelCase keys to frontend
        postCount,
        postLength,
        autoBlogEnabled
      },
      message: 'Settings updated successfully'
    });
  } catch (error: unknown) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update settings' 
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
} 