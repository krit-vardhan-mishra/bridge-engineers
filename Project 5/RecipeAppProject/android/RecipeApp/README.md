# Recipe App - Complete Setup Guide

## Overview
This is a complete Recipe App with an Android frontend and Express.js backend hosted on Vercel, using MongoDB Atlas for data storage.

## Features
- ✅ View recipes from MongoDB database
- ✅ Add new recipes with images
- ✅ Save/bookmark favorite recipes locally
- ✅ Search recipes by name, description, or ingredients
- ✅ Empty state handling ("No Recipe Yet Add your first recipe to get started")
- ✅ Image upload support via Cloudinary
- ✅ Responsive Android UI with Material Design

## Backend Setup (Express.js + MongoDB + Vercel)

### 1. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist your IP address (or use 0.0.0.0/0 for development)

### 2. Cloudinary Setup (for image uploads)
1. Create a Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret from the dashboard

### 3. Environment Variables
Create a `.env` file in the `backend` directory:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipeapp?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the backend directory: `cd backend`
3. Run: `vercel`
4. Follow the prompts and deploy
5. Add environment variables in Vercel dashboard
6. Note your deployment URL (e.g., `https://your-app.vercel.app`)

### 5. Backend API Endpoints
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create a new recipe
- `GET /api/recipes/:id` - Get a specific recipe
- `PUT /api/recipes/:id` - Update a recipe
- `DELETE /api/recipes/:id` - Delete a recipe
- `GET /api/health` - Health check

## Android App Setup

### 1. Configure API Settings
1. Copy `local.properties.template` to `local.properties`
2. Fill in your actual Vercel deployment URL and authentication bypass parameters:
   ```properties
   PRODUCTION_BASE_URL=https://your-actual-deployment.vercel.app/api/
   VERCEL_AUTH_BYPASS=?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=your-bypass-key
   ```
   
   **Note**: The `local.properties` file is automatically ignored by Git to keep your credentials secure.

### 2. Build and Run
1. Open the project in Android Studio
2. Sync Gradle files
3. Run the app on an emulator or device

### 3. App Behavior
- **Empty State**: When no recipes exist in the database, shows "No Recipe Yet Add your first recipe to get started"
- **Data from Database**: All recipes are fetched from MongoDB Atlas, no pre-inserted sample data
- **Add Recipe**: Users can add recipes which are stored in the database
- **Search**: Real-time search across recipe names, descriptions, and ingredients
- **Save/Bookmark**: Recipes can be saved locally using Room database

## Project Structure
```
RecipeApp/
├── android/RecipeApp/          # Android application
│   ├── app/src/main/java/      # Kotlin source code
│   ├── app/src/main/res/       # Android resources
│   └── app/build.gradle.kts    # Android dependencies
└── backend/                    # Express.js backend
    ├── api.js                  # Main API server (Vercel entry point)
    ├── server.js               # Local development server
    ├── cloudinary.js           # Image upload configuration
    ├── package.json            # Node.js dependencies
    ├── vercel.json            # Vercel deployment config
    └── .env                   # Environment variables (not committed)
```

## Database Schema
```javascript
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,                    // Cloudinary URL
  cookingTime: { type: String, required: true },
  difficulty: { type: String, required: true },
  rating: { type: Number, default: 0 },
  description: String,
  ingredients: [String],
  instructions: [String],
  servings: { type: Number, default: 1 },
  createdDate: { type: Date, default: Date.now }
});
```

## Security Configuration

### Vercel Authentication Bypass
If your Vercel deployment has protection enabled, you may encounter authentication errors. The app automatically handles this by:

1. **Automatic Parameter Injection**: The `VercelAuthBypassInterceptor` automatically adds bypass parameters to all API requests
2. **Secure Configuration**: Sensitive URLs and bypass keys are stored in `local.properties` (not committed to Git)
3. **Fallback Handling**: If bypass parameters are not configured, requests proceed normally

### Configuration Security
- ✅ `local.properties` is ignored by Git
- ✅ Sensitive URLs are not hardcoded in source code
- ✅ Build-time configuration injection via Gradle
- ✅ Automatic parameter injection for API requests

## Testing the Application

### 1. Test Backend
```bash
# Health check
curl https://your-deployment-url.vercel.app/api/health

# Get all recipes (should return empty array initially)
curl https://your-deployment-url.vercel.app/api/recipes
```

### 2. Test Android App
1. Launch the app
2. Should show empty state message
3. Tap the + button to add a recipe
4. Fill in recipe details and save
5. Recipe should appear in the list
6. Test search functionality

## Troubleshooting

### Common Issues:
1. **Network Error**: Check if the API URL in RecipeApiService.kt is correct
2. **Database Connection**: Verify MongoDB URI and network access
3. **Empty State Not Showing**: Ensure the RecipeRepository is properly handling empty responses
4. **Image Upload Issues**: Check Cloudinary configuration

### Debug Steps:
1. Check Vercel deployment logs
2. Monitor Android Studio logcat for errors
3. Test API endpoints directly with curl or Postman
4. Verify environment variables in Vercel dashboard

## Security Notes
- MongoDB Atlas has built-in security with user authentication
- Cloudinary API keys should be kept secure
- Consider implementing API rate limiting for production
- The Android app uses HTTPS for all API calls

## Future Enhancements
- User authentication and personal recipe collections
- Recipe categories and filtering
- Recipe sharing functionality
- Offline support with local caching
- Push notifications for new recipes
