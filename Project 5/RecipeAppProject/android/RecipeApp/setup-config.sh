#!/bin/bash

echo "🔧 Recipe App Configuration Setup"
echo "================================="

# Check if local.properties already exists
if [ -f "local.properties" ]; then
    echo "⚠️  local.properties already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Copy template
if [ -f "local.properties.template" ]; then
    cp local.properties.template local.properties
    echo "✅ Created local.properties from template"
else
    echo "❌ Template file not found"
    exit 1
fi

echo ""
echo "📝 Next Steps:"
echo "1. Edit local.properties file"
echo "2. Add your actual Vercel deployment URL"
echo "3. Add your Vercel authentication bypass parameters"
echo "4. Sync Gradle and build the project"
echo ""
echo "📄 Example configuration:"
echo "PRODUCTION_BASE_URL=https://your-app.vercel.app/api/"
echo "VERCEL_AUTH_BYPASS=?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=yourkey"
echo ""
echo "🔒 Remember: local.properties is ignored by Git for security!"
