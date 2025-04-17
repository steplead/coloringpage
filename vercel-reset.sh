#!/bin/bash

echo "Comparing local environment with Vercel environment..."

# First, list current environment variables in Vercel
echo "Current Vercel environment variables:"
npx vercel env ls

# Remove all existing environment variables
echo "Removing all SiliconFlow API environment variables..."
npx vercel env rm SILICONFLOW_API_KEY production -y || true
npx vercel env rm SILICONFLOW_API_URL production -y || true
npx vercel env rm SILICONFLOW_MODEL production -y || true

# Add the exact API variables from local .env.local
echo "Adding identical SiliconFlow API variables..."
echo "Adding SILICONFLOW_API_KEY..."
npx vercel env add SILICONFLOW_API_KEY production <<< "sk-lglylfszounxeiisibvjhjqbapvedzcdsqpvulycjfhtlphc"
npx vercel env add SILICONFLOW_API_URL production <<< "https://api.siliconflow.cn/v1/images/generations"
echo "Adding SILICONFLOW_MODEL..."
npx vercel env add SILICONFLOW_MODEL production <<< "Kwai-Kolors/Kolors"

# Deploy without making any code changes
echo "Deploying with identical configuration..."
npx vercel --prod

echo "Deployment complete. Vercel environment now exactly matches local environment." 