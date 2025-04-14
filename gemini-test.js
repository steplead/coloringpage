// Simple Node.js script to test Gemini API
const fs = require('fs');
const https = require('https');

// Read API key from .env.local file
const envContent = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=([^\n]+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
  console.error('API key not found in .env.local file');
  process.exit(1);
}

// Create the request options
const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1/models/gemini-pro:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create the request body
const requestBody = JSON.stringify({
  contents: [{
    parts: [{
      text: "Write a single sentence response."
    }]
  }]
});

// Send the request
const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.candidates && parsedData.candidates.length > 0) {
        console.log('Generated text:', parsedData.candidates[0].content.parts[0].text);
      }
    } catch (e) {
      console.error('Error parsing JSON response:', e);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

// Write the request body and end the request
req.write(requestBody);
req.end();

console.log('Sending request to Gemini API...');
console.log('API Key (first 5 chars):', apiKey.substring(0, 5) + '...'); 