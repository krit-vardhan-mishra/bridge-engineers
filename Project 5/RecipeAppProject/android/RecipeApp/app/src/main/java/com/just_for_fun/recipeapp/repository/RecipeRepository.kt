package com.just_for_fun.recipeapp.repository

import android.content.Context
import com.just_for_fun.recipeapp.database.AppDatabase
import com.just_for_fun.recipeapp.database.SavedRecipeEntity
import com.just_for_fun.recipeapp.model.Recipe
import com.just_for_fun.recipeapp.network.RetrofitClient
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class RecipeRepository(private val context: Context) {

    private val apiService = RetrofitClient.apiService
    private val savedRecipeDao = AppDatabase.getDatabase(context).savedRecipeDao()

    // Fetch recipes from backend
    fun getRecipes(): Flow<List<Recipe>> = flow {
        try {
            val recipes = apiService.getRecipes()
            emit(recipes)
        } catch (e: Exception) {
            // Log the error for debugging
            android.util.Log.e("RecipeRepository", "Error fetching recipes", e)
            // Emit empty list when there's an error or no data
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

    // Add new recipe to backend
    suspend fun addRecipe(recipe: Recipe): Recipe {
        return apiService.createRecipe(recipe)
    }
}
