# AI Coloring Page API Reference

This document provides information about the API used in the AI Coloring Page application.

## SiliconFlow Image Generation API

### Core Information
- **Purpose**: AI-based image generation for coloring pages
- **Endpoint**: `https://api.siliconflow.cn/v1/images/generations`
- **Model**: `Kwai-Kolors/Kolors`
- **API Key**: `sk-frjnkxrmiaajoxjziaqgwmyorlermfnpbctcchsvazrlxeah`

### Request Parameters
```json
{
  "model": "Kwai-Kolors/Kolors",
  "prompt": "Description of the image to generate",
  "num_inference_steps": 30,
  "guidance_scale": 7.5
}
```

### Implementation Details
- Used in `/api/generate` endpoint to create coloring pages
- Handles image generation with custom prompts
- Returns image URL that is then saved to the gallery

## Google Gemini API

### Core Information
- **Purpose**: AI-powered text generation and enhancement
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Model**: `gemini-2.0-flash`
- **API Key**: `AIzaSyBSo6E7uZR7IvaRfiNZSdpgGwg8uzE6xow`

### Request Parameters
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt text here"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  }
}
```

### cURL Example
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBSo6E7uZR7IvaRfiNZSdpgGwg8uzE6xow" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [{
    "parts":[{"text": "Explain how AI works"}]
    }]
   }'
```

### Implementation Details
- Can be used for prompt enhancement and optimization
- Potential use for generating blog content for SEO
- Helps improve user experience with better content generation

## Supabase Data Storage

### Core Information
- **Purpose**: Database for storing generated images and gallery management
- **URL**: `https://hjmwtgqvmqaontbjebpi.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbXd0Z3F2bXFhb250YmplYnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NjA0NzIsImV4cCI6MjA1OTEzNjQ3Mn0.M0JVWdQk14MPtTbL-q9zyPjl36kYotRTw7L-aF9iK_A`

### Implementation
- Used to store information about generated images
- Manages public gallery of coloring pages
- Provides APIs for retrieving and saving images

## Application API Endpoints

### Image Generation
- **Endpoint**: `/api/generate`
- **Method**: POST
- **Purpose**: Generate coloring page images from text descriptions

### Gallery Management
- **Endpoint**: `/api/save-to-gallery`
- **Method**: POST
- **Purpose**: Save generated images to public gallery

### Image Optimization
- **Endpoint**: `/api/optimize`
- **Method**: POST
- **Purpose**: Optimize images for better coloring experience

### Text Generation (Gemini)
- **Endpoint**: `/api/gemini`
- **Method**: POST
- **Purpose**: Generate or enhance text content using Google Gemini AI 