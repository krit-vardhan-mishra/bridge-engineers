package com.just_for_fun.recipeapp.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.just_for_fun.recipeapp.model.Recipe
import com.just_for_fun.recipeapp.repository.RecipeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class RecipeViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = RecipeRepository(application)

    private val _recipes = MutableStateFlow<List<Recipe>>(emptyList())
    val recipes: StateFlow<List<Recipe>> = _recipes

    private val _savedRecipes = MutableStateFlow<List<Recipe>>(emptyList())
    val savedRecipes: StateFlow<List<Recipe>> = _savedRecipes

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    init {
        loadRecipes()
        loadSavedRecipes()
    }

    fun loadRecipes() {
        viewModelScope.launch {
            _isLoading.value = true
            repository.getRecipes().collect { recipeList ->
                _recipes.value = recipeList
                _isLoading.value = false
            }
        }
    }

    fun loadSavedRecipes() {
        viewModelScope.launch {
            repository.getSavedRecipes().collect { savedList ->
                _savedRecipes.value = savedList
            }
        }
    }

    fun saveRecipe(recipe: Recipe) {
        viewModelScope.launch {
            repository.saveRecipe(recipe)
            loadSavedRecipes() // Refresh saved recipes
        }
    }

    fun removeSavedRecipe(recipeId: String) {
        viewModelScope.launch {
            repository.removeSavedRecipe(recipeId)
            loadSavedRecipes() // Refresh saved recipes
        }
    }

    suspend fun isRecipeSaved(recipeId: String): Boolean {
        return repository.isRecipeSaved(recipeId)
    }

    fun addRecipe(recipe: Recipe) {
        viewModelScope.launch {
            try {
                repository.addRecipe(recipe)
                loadRecipes() // Refresh recipes after adding
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
}
