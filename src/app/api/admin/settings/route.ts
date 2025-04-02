import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define settings table name
const SETTINGS_TABLE = 'app_settings';

// Default settings
const defaultSettings = {
  postCount: 1,
  postLength: 800
};

// Helper function to ensure settings table exists
async function ensureSettingsTable() {
  try {
    // Create the table if it doesn't exist (using direct SQL)
    const { error } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ${SETTINGS_TABLE} (
          id TEXT PRIMARY KEY,
          post_count INTEGER NOT NULL DEFAULT 1,
          post_length INTEGER NOT NULL DEFAULT 800,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    });
    
    if (error) {
      console.error('Error creating settings table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring settings table exists:', error);
    return false;
  }
}

// Helper function to read settings from Supabase
async function readSettings() {
  try {
    // Ensure the table exists
    await ensureSettingsTable();
    
    // Get settings
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select('*')
      .eq('id', 'blog_settings')
      .single();
    
    if (error || !data) {
      // Create default settings if not found
      await saveSettings(defaultSettings);
      return defaultSettings;
    }
    
    return {
      postCount: data.post_count || defaultSettings.postCount,
      postLength: data.post_length || defaultSettings.postLength
    };
  } catch (error) {
    console.error('Error reading settings:', error);
    return defaultSettings;
  }
}

// Helper function to save settings to Supabase
async function saveSettings(settings: any) {
  try {
    // Ensure the table exists
    await ensureSettingsTable();
    
    // Insert or update settings
    const { error } = await supabase
      .from(SETTINGS_TABLE)
      .upsert({
        id: 'blog_settings',
        post_count: settings.postCount,
        post_length: settings.postLength,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving settings to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

// GET handler to retrieve current settings
export async function GET(request: NextRequest) {
  console.log('GET /api/admin/settings: Fetching settings');
  try {
    const settings = await readSettings();
    
    // Update environment variables to reflect current settings
    process.env.AUTO_BLOG_POST_COUNT = String(settings.postCount);
    process.env.AUTO_BLOG_POST_LENGTH = String(settings.postLength);
    
    console.log('GET /api/admin/settings: Returning settings', settings);
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error getting settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to retrieve settings' 
    }, { status: 500 });
  }
}

// POST handler to update settings
export async function POST(request: NextRequest) {
  console.log('POST /api/admin/settings: Saving settings');
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
      }, { status: 400 });
    }
    
    if (isNaN(postLength) || postLength < 500 || postLength > 5000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post length must be between 500 and 5000 words' 
      }, { status: 400 });
    }
    
    // Update settings
    const newSettings = {
      postCount,
      postLength
    };
    
    console.log('POST /api/admin/settings: Saving new settings', newSettings);
    const success = await saveSettings(newSettings);
    
    if (!success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save settings' 
      }, { status: 500 });
    }
    
    // Update environment variables to reflect new settings
    process.env.AUTO_BLOG_POST_COUNT = String(postCount);
    process.env.AUTO_BLOG_POST_LENGTH = String(postLength);
    
    console.log('POST /api/admin/settings: Settings saved successfully');
    return NextResponse.json({ 
      success: true, 
      settings: newSettings,
      message: 'Settings updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to update settings' 
    }, { status: 500 });
  }
} 