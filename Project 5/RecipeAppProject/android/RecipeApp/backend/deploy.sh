#!/bin/bash

echo "🚀 Deploying RecipeApp Backend..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "Update your Android app's BASE_URL with the new deployment URL"
