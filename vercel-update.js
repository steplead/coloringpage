const fs = require('fs');

// Function to create a vercel.json file with environment variables
function updateVercelEnvVariables() {
  try {
    // Create a vercel.json file with basic configuration and environment variables
    const vercelConfig = {
      "env": {
        "GEMINI_API_KEY": "AIzaSyBSo6E7uZR7IvaRfiNZSdpgGwg8uzE6xow",
        "GEMINI_API_URL": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        "GEMINI_MODEL": "gemini-2.0-flash"
      },
      "crons": [
        {
          "path": "/api/blog/cron",
          "schedule": "0 0 * * 1"  // Weekly on Mondays
        }
      ]
    };

    fs.writeFileSync('vercel-env-update.json', JSON.stringify(vercelConfig, null, 2));
    console.log('Created vercel-env-update.json file with Gemini API configuration');
    console.log('Please upload this file to your Vercel project or copy the settings manually.');
    console.log('\nEnv vars to add manually in Vercel dashboard:');
    console.log('- GEMINI_API_KEY: AIzaSyBSo6E7uZR7IvaRfiNZSdpgGwg8uzE6xow');
    console.log('- GEMINI_API_URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent');
    console.log('- GEMINI_MODEL: gemini-2.0-flash');
    
    console.log('\nAfter updating the environment variables, please run:');
    console.log('curl -X POST https://www.ai-coloringpage.com/api/blog/auto-generate -H "Content-Type: application/json" -d \'{"count": 3, "targetLength": 800}\'');
    console.log('\nThis will generate your first blog posts, and then you can visit:');
    console.log('https://www.ai-coloringpage.com/blog');
  } catch (error) {
    console.error('Error updating Vercel environment variables:', error.message);
  }
}

// Run the function
updateVercelEnvVariables(); 