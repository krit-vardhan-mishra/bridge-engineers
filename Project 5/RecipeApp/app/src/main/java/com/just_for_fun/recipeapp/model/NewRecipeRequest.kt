package com.just_for_fun.recipeapp.model

import com.google.gson.annotations.SerializedName

/**
 * Data class for sending a new recipe to the backend.
 * Omits the id field to let the MongoDB backend generate it automatically.
 */
data class NewRecipeRequest(
    val name: String,
    val image: String = "",
    val cookingTime: String,
    val difficulty: String,
    val rating: Float,
    val description: String = "",
    val ingredients: List<String> = emptyList(),
    val instructions: List<String> = emptyList(),
    val servings: Int = 1,
    val createdDate: String = ""
) {
    companion object {
        fun fromRecipe(recipe: Recipe): NewRecipeRequest {
            return NewRecipeRequest(
                name = recipe.name,
                image = recipe.image,
                cookingTime = recipe.cookingTime,
                difficulty = recipe.difficulty,
                rating = recipe.rating,
                description = recipe.description,
                ingredients = recipe.ingredients,
                instructions = recipe.instructions,
                servings = recipe.servings,
                createdDate = recipe.createdDate
            )
        }
    }
}
