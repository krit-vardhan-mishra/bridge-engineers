#!/bin/bash

echo "🚀 Deploying RecipeApp Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create a .env file with:"
    echo "   MONGODB_URI=your_mongodb_connection_string"
    echo "   CLOUDINARY_CLOUD_NAME=your_cloud_name"
    echo "   CLOUDINARY_API_KEY=your_api_key"
    echo "   CLOUDINARY_API_SECRET=your_api_secret"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Test syntax
echo "🔍 Checking syntax..."
node -c api.js
if [ $? -ne 0 ]; then
    echo "❌ Syntax errors found!"
    exit 1
fi

echo "✅ Syntax check passed"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Next steps:"
echo "   1. Update Android app's PRODUCTION_BASE_URL in RecipeApiService.kt"
echo "   2. Add environment variables in Vercel dashboard"
echo "   3. Test API endpoints at: https://your-app.vercel.app/api/health"
