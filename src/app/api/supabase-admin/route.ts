import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Function to create the settings table if it doesn't exist
async function createSettingsTable() {
  try {
    // First try to insert data to see if the table exists
    const { error: insertError } = await supabase.from('app_settings').insert({
      id: 'blog_settings',
      post_count: 1,
      post_length: 800,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // If no error, the table exists and we inserted the defaults
    if (!insertError) {
      return { success: true, message: 'Settings table exists and initialized with defaults' };
    }
    
    // If error code is not "relation does not exist", it's another error
    if (!insertError.message.includes('relation') && !insertError.message.includes('does not exist')) {
      console.error('Error inserting into app_settings:', insertError);
      return { success: false, error: insertError.message };
    }
    
    // We need to create the table
    console.log('App settings table does not exist, we need to create it');
    
    // For Supabase, we'll use REST API to execute an SQL function
    // This is a workaround since we can't create tables directly from the client
    
    // First, let's try a simpler approach - let the API side implementation handle it
    // We'll update the admin settings API to create the table if needed
    
    return { 
      success: false, 
      error: 'Table does not exist. Please use the admin dashboard to create the settings.',
      message: 'The app_settings table needs to be created. When you access the admin dashboard, it will try to create it automatically.'
    };
  } catch (error: any) {
    console.error('Error in createSettingsTable:', error);
    return { success: false, error: error.message };
  }
}

// Route handler for GET requests
export async function GET(request: NextRequest) {
  // Check for admin password in query param
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');
  
  if (password !== 'admin123') {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized access' 
    }, { status: 401 });
  }
  
  try {
    // Check database setup
    const setupResult = await createSettingsTable();
    
    return NextResponse.json({
      success: true,
      message: 'Supabase admin check complete',
      setup: setupResult
    });
  } catch (error: any) {
    console.error('Error in Supabase admin route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
} 