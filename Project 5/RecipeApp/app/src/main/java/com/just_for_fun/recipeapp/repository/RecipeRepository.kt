package com.just_for_fun.recipeapp.repository

import android.content.Context
import android.net.Uri
import android.util.Log
import com.just_for_fun.recipeapp.database.AppDatabase
import com.just_for_fun.recipeapp.database.SavedRecipeEntity
import com.just_for_fun.recipeapp.model.Recipe
import com.just_for_fun.recipeapp.network.RetrofitClient
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class RecipeRepository(private val context: Context) {
    companion object {
        private const val TAG = "RecipeRepository"
    }

    private val apiService = RetrofitClient.apiService
    private val savedRecipeDao = AppDatabase.getDatabase(context).savedRecipeDao()

    // Fetch recipes from backend
    fun getRecipes(): Flow<List<Recipe>> = flow {
        try {
            Log.d(TAG, "🔍 Fetching recipes from backend at URL: ${apiService.getRecipes()}")
            val recipes = apiService.getRecipes()
            Log.d(TAG, "✅ Successfully fetched recipes: $recipes")
            emit(recipes)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error fetching recipes: ${e.message}", e)
            emit(emptyList())
        }
    }

    // Get saved recipes from local database
    fun getSavedRecipes(): Flow<List<Recipe>> = flow {
        val savedEntities = savedRecipeDao.getAllSavedRecipes()
        val savedRecipes = savedEntities.map { it.toRecipe() }
        emit(savedRecipes)
    }

    // Save recipe to local database
    suspend fun saveRecipe(recipe: Recipe) {
        val currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
        val entity = SavedRecipeEntity.fromRecipe(recipe, currentDate)
        savedRecipeDao.insertSavedRecipe(entity)
    }

    // Remove saved recipe from local database
    suspend fun removeSavedRecipe(recipeId: String) {
        savedRecipeDao.deleteSavedRecipeById(recipeId)
    }

    // Check if recipe is saved
    suspend fun isRecipeSaved(recipeId: String): Boolean {
        return savedRecipeDao.getSavedRecipeById(recipeId) != null
    }

    // Add new recipe to backend (without image)
    suspend fun addRecipe(recipe: Recipe): Recipe {
        Log.d(TAG, "📤 Adding recipe to backend at URL: ${apiService.createRecipe(recipe)}")
        Log.d(TAG, "📝 Recipe payload: $recipe")
        return try {
            val response = apiService.createRecipe(recipe)
            Log.d(TAG, "✅ Recipe added successfully: $response")
            response
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error adding recipe: ${e.message}", e)
            throw e
        }
    }

    // Add new recipe with image to backend
    suspend fun addRecipeWithImage(recipe: Recipe, imageUri: Uri?): Recipe {
        Log.d(TAG, "🚀 Starting recipe upload with image...")
        Log.d(TAG, "📝 Recipe name: ${recipe.name}")
        Log.d(TAG, "🖼️ Image URI: $imageUri")

        return try {
            // Prepare multipart data
            val nameBody = recipe.name.toRequestBody("text/plain".toMediaTypeOrNull())
            val cookingTimeBody = recipe.cookingTime.toRequestBody("text/plain".toMediaTypeOrNull())
            val difficultyBody = recipe.difficulty.toRequestBody("text/plain".toMediaTypeOrNull())
            val descriptionBody = (recipe.description ?: "").toRequestBody("text/plain".toMediaTypeOrNull())
            val servingsBody = recipe.servings.toString().toRequestBody("text/plain".toMediaTypeOrNull())
            val ratingBody = recipe.rating.toString().toRequestBody("text/plain".toMediaTypeOrNull())
            val createdDateBody = recipe.createdDate.toRequestBody("text/plain".toMediaTypeOrNull())
            
            // Convert lists to JSON strings
            val ingredientsJson = recipe.ingredients.joinToString("\n")
            val instructionsJson = recipe.instructions.joinToString("\n")
            val ingredientsBody = ingredientsJson.toRequestBody("text/plain".toMediaTypeOrNull())
            val instructionsBody = instructionsJson.toRequestBody("text/plain".toMediaTypeOrNull())

            // Handle image file
            var imagePart: MultipartBody.Part? = null
            if (imageUri != null) {
                Log.d(TAG, "📁 Processing image file...")
                val imageFile = createFileFromUri(imageUri)
                if (imageFile != null) {
                    val requestFile = imageFile.asRequestBody("image/*".toMediaTypeOrNull())
                    imagePart = MultipartBody.Part.createFormData("image", imageFile.name, requestFile)
                    Log.d(TAG, "✅ Image file prepared for upload: ${imageFile.name}")
                } else {
                    Log.w(TAG, "⚠️ Failed to create file from URI")
                }
            }

            Log.d(TAG, "☁️ Uploading recipe to backend...")
            val result = apiService.createRecipeWithImage(
                nameBody,
                cookingTimeBody,
                difficultyBody,
                descriptionBody,
                ingredientsBody,
                instructionsBody,
                servingsBody,
                ratingBody,
                createdDateBody,
                imagePart
            )
            
            Log.d(TAG, "✅ Recipe uploaded successfully with ID: ${result.id}")
            result
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to upload recipe: ${e.message}", e)
            throw e
        }
    }

    private fun createFileFromUri(uri: Uri): File? {
        return try {
            Log.d(TAG, "🔄 Converting URI to file...")
            val inputStream: InputStream? = context.contentResolver.openInputStream(uri)
            val tempFile = File(context.cacheDir, "temp_image_${System.currentTimeMillis()}.jpg")
            
            inputStream?.use { input ->
                FileOutputStream(tempFile).use { output ->
                    input.copyTo(output)
                }
            }
            
            Log.d(TAG, "✅ File created: ${tempFile.name}, size: ${tempFile.length()} bytes")
            tempFile
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error creating file from URI: ${e.message}", e)
            null
        }
    }
}
