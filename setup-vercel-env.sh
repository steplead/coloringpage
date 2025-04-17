#!/bin/bash

echo "Removing existing environment variables..."
npx vercel env rm SILICONFLOW_API_KEY production -y || true
npx vercel env rm SILICONFLOW_API_URL production -y || true
npx vercel env rm SILICONFLOW_MODEL production -y || true

# Add SiliconFlow API Configuration
echo "Adding SiliconFlow API configuration..."
echo "Adding SILICONFLOW_API_KEY..."
npx vercel env add SILICONFLOW_API_KEY production <<< "sk-lglylfszounxeiisibvjhjqbapvedzcdsqpvulycjfhtlphc"
npx vercel env add SILICONFLOW_API_URL production <<< "https://api.siliconflow.cn/v1/images/generations"
echo "Adding SILICONFLOW_MODEL..."
npx vercel env add SILICONFLOW_MODEL production <<< "Kwai-Kolors/Kolors"

# Add Image Generation Configuration
echo "Adding Image Generation configuration..."
npx vercel env add DEFAULT_IMAGE_SIZE production <<< "1024"
npx vercel env add MAX_RETRY_ATTEMPTS production <<< "3"
npx vercel env add MIN_QUALITY_SCORE production <<< "7.0"

# Add Cache Configuration
echo "Adding Cache configuration..."
npx vercel env add CACHE_DURATION production <<< "3600"
npx vercel env add MAX_CACHE_SIZE production <<< "100"

# Add SEO Configuration
echo "Adding SEO configuration..."
npx vercel env add NEXT_PUBLIC_SITE_URL production <<< "https://coloringpage-rieuoxy0k-stepleads-projects.vercel.app"
npx vercel env add NEXT_PUBLIC_SITE_NAME production <<< "AI Coloring Page Generator"
npx vercel env add NEXT_PUBLIC_SITE_DESCRIPTION production <<< "Create custom coloring pages instantly with AI. Free printable coloring pages for kids and adults."

echo "All environment variables have been updated. Redeploying..."
npx vercel --prod 