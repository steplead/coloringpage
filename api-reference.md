# PostMaker7 API Reference

This document provides comprehensive information about all APIs used in the PostMaker7 WordPress plugin.

## 1. Google Gemini API

### Core Information
- **Purpose**: Main content generation engine
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Model**: Gemini 2.0 Flash
- **Default API Key**: `AIzaSyC7hufeCYed8QFFKuA21-9Dz-4lC26Be_c`
- **WordPress Option**: `postmaker7_api_key`

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
    "maxOutputTokens": 8192
  },
  "safetySettings": [
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
}
```

### Implementation Details
- **Class**: `PostMaker7_API`
- **Methods**:
  - `test_connection()`: Tests API connection
  - `generate_content()`: Sends content generation request
  - `send_request()`: Handles HTTP request with error handling
- **Error Handling**: Comprehensive with detailed error messages and logging
- **Features**: Support for different content lengths and languages

## 2. SiliconFlow Image Generation API

### Core Information
- **Purpose**: AI-based image generation for article featured images
- **Endpoint**: `https://api.siliconflow.cn/v1/images/generations`
- **Model**: `black-forest-labs/FLUX.1-schnell`
- **Default API Key**: `sk-frjnkxrmiaajoxjziaqgwmyorlermfnpbctcchsvazrlxeah`
- **WordPress Option**: `postmaker7_image_api_key`

### Request Parameters
```json
{
  "model": "black-forest-labs/FLUX.1-schnell",
  "prompt": "Description of the image to generate",
  "seed": 123456
}
```

### Implementation Details
- **Class**: `PostMaker7_Image_Generator`
- **Methods**:
  - `test_connection()`: Tests API connection
  - `generate_image()`: Generates single image
  - `generate_multiple_images()`: Batch image generation
  - `save_image_to_media_library()`: Saves generated image to WordPress media
- **Error Handling**: Implements retry mechanism with exponential backoff (up to 3 retries)
- **Features**: 
  - WebP conversion for optimization
  - Customizable dimensions and quality
  - Maintains aspect ratio option

## 3. Google Custom Search API

### Core Information
- **Purpose**: Find authoritative PDF documents and references
- **Endpoint**: `https://www.googleapis.com/customsearch/v1`
- **Alternative Endpoint**: `https://www.googleapis.com/customsearch/v1/siterestrict`
- **Default API Key**: `AIzaSyDKBhtDp642D_PVTMK3Xye1MN2FJT1sctE`
- **Default Search Engine ID**: `b3e2dba475505478d`
- **WordPress Options**:
  - API Key: `postmaker7_google_api_key`
  - Search Engine ID: `postmaker7_google_search_engine_id`
  - Only Google PDF: `postmaker7_only_google_pdf`
  - Fallback to Google PDF: `postmaker7_fallback_to_google_pdf`

### Search Query Templates
1. `{search_term} filetype:pdf`
2. `{search_term} technical paper pdf`
3. `{search_term} whitepaper`
4. `{search_term} site:.edu OR site:.gov OR site:.org`
5. `{search_term} research OR documentation OR official`

### Usage Limits
- **Daily Limit**: 100 requests per day
- **Tracking Option**: `postmaker7_google_api_calls_{YYYY-MM-DD}`
- **Monitoring**: Admin UI displays usage stats and warnings when nearing limit
- **Reset Capability**: Admin can reset counter via AJAX call

### Implementation Details
- **Functions**:
  - `search_google_for_pdf()`: Main search function
  - `get_google_api_calls_today()`: Retrieves current usage count
  - `reset_google_api_calls_counter()`: Resets usage counter
  - `search_authority_sites()`: Specialized search for trusted domains
- **Result Validation**: Trust-based filtering system (0-10 scale)
- **Caching**: 24-hour cache via WordPress transients
- **Error Handling**: Graceful degradation and fallback mechanisms

## 4. WordPress REST API Endpoints

### Custom Endpoints
- **Base Path**: `/postmaker7/v1`
- **Content Generation Endpoint**:
  - Path: `/generate`
  - Method: POST
  - Permission: `edit_posts` capability
- **API Test Endpoint**:
  - Path: `/test-api`
  - Method: GET
  - Permission: `manage_options` capability

## 5. AJAX Endpoints

### Core Endpoints
- **Test API**: `postmaker7_test_api`
- **Generate Content**: `postmaker7_generate_content`
- **Create Post**: `postmaker7_create_post`
- **History Operations**:
  - `postmaker7_get_history_content`
  - `postmaker7_create_post_from_history`
- **Image Generation**:
  - `postmaker7_test_image_api`
  - `postmaker7_generate_image`
  - `postmaker7_generate_multiple_images`
- **API Counter Reset**: `postmaker7_reset_api_counter`

## Setup Instructions

### Google Gemini API
1. Visit Google AI Studio
2. Create API key
3. Enter in plugin settings or use default

### Google Custom Search API
1. Visit https://developers.google.com/custom-search/v1/overview
2. Click "Get Key" to create API key
3. Visit https://programmablesearchengine.google.com/controlpanel/create to create search engine
4. Enable "Search the entire web" option
5. Get Search Engine ID from Settings > Basic > Search Engine ID
6. Enter both values in plugin settings or use defaults

### SiliconFlow Image API
1. Visit SiliconFlow website
2. Create account and get API key
3. Enter in plugin settings or use default 