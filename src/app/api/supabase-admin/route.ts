import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Function to create the settings table if it doesn't exist
async function createSettingsTable() {
  try {
    // Check if the table already exists
    const { data: tableExists } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'app_settings')
      .single();
    
    if (tableExists) {
      return { success: true, message: 'Settings table already exists' };
    }
    
    // Create the settings table
    const { error } = await supabase.rpc('create_table_if_not_exists', {
      table_sql: `
        CREATE TABLE IF NOT EXISTS app_settings (
          id TEXT PRIMARY KEY,
          post_count INTEGER NOT NULL DEFAULT 1,
          post_length INTEGER NOT NULL DEFAULT 800,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
        
        INSERT INTO app_settings (id, post_count, post_length) 
        VALUES ('blog_settings', 1, 800)
        ON CONFLICT (id) DO NOTHING;
      `
    });
    
    if (error) {
      console.error('Error creating settings table:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Settings table created successfully' };
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