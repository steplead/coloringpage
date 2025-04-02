import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the settings file path
const settingsFile = path.join(process.cwd(), 'settings.json');

// Default settings
const defaultSettings = {
  postCount: 1,
  postLength: 800
};

// Helper function to read settings
async function readSettings() {
  try {
    if (!fs.existsSync(settingsFile)) {
      // Create default settings file if it doesn't exist
      fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }

    const rawData = fs.readFileSync(settingsFile, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading settings file:', error);
    return defaultSettings;
  }
}

// Helper function to save settings
async function saveSettings(settings: any) {
  try {
    const updatedSettings = {
      ...defaultSettings,
      ...settings
    };
    
    fs.writeFileSync(settingsFile, JSON.stringify(updatedSettings, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving settings file:', error);
    return false;
  }
}

// GET handler to retrieve current settings
export async function GET(request: NextRequest) {
  try {
    const settings = await readSettings();
    
    // Update environment variables to reflect current settings
    process.env.AUTO_BLOG_POST_COUNT = String(settings.postCount);
    process.env.AUTO_BLOG_POST_LENGTH = String(settings.postLength);
    
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
  try {
    const data = await request.json();
    
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