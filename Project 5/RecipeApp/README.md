# Recipe App - Complete Setup Guide

## Overview
This is a complete Recipe App with an Android frontend and a backend API hosted on Render.com, using MongoDB Atlas for data storage.

## Features
- ✅ View recipes from MongoDB database via Render API
- ✅ Add new recipes with images
- ✅ Save/bookmark favorite recipes locally
- ✅ Search recipes by name, description, or ingredients
- ✅ Loading spinner while fetching data from backend
- ✅ Empty state handling ("No Recipe Yet Add your first recipe to get started")
- ✅ Image upload support via Cloudinary
- ✅ Responsive Android UI with Material Design

## Backend API
This app connects to a deployed backend API at: https://recipe-app-backend-ihr5.onrender.com/

### API Endpoints
- `GET /recipes` - Get all recipes
- `POST /recipes` - Create a new recipe
- `GET /recipes/:id` - Get a specific recipe
- `PUT /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe
- `GET /health` - Health check

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
2. The API URL is already configured to use the Render.com backend:
   ```properties
   PRODUCTION_BASE_URL=https://recipe-app-backend-ihr5.onrender.com/
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
├── app/                        # Android application
│   ├── src/main/java/          # Kotlin source code
│   ├── src/main/res/           # Android resources
│   └── build.gradle.kts        # Android dependencies
├── gradle/                     # Gradle wrapper and dependencies
└── local.properties            # Local configuration (API URL)
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

### Configuration Security
- ✅ `local.properties` is ignored by Git
- ✅ API URL is not hardcoded in source code
- ✅ Build-time configuration injection via Gradle

## Testing the Application

### 1. Test Backend API
```bash
# Health check
curl https://recipe-app-backend-ihr5.onrender.com/health

# Get all recipes
curl https://recipe-app-backend-ihr5.onrender.com/recipes
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
1. **Network Error**: Check if the Render.com API is available
2. **Loading Spinner Showing Too Long**: API server might be restarting after inactivity
3. **Empty State Not Showing**: Ensure the RecipeRepository is properly handling empty responses
4. **Image Upload Issues**: Check if the backend API is properly handling uploads

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
