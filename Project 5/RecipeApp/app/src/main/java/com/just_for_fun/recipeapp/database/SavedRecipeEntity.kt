package com.just_for_fun.recipeapp.database

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.just_for_fun.recipeapp.model.Recipe

@Entity(tableName = "saved_recipes")
data class SavedRecipeEntity(
    @PrimaryKey val id: String,
    val name: String,
    val image: String,
    val cookingTime: String,
    val difficulty: String,
    val rating: Float,
    val description: String,
    val ingredientsJson: String, // Store as JSON string
    val instructionsJson: String, // Store as JSON string
    val servings: Int,
    val savedDate: String,
    val createdDate: String
) {
    fun toRecipe(): Recipe {
        val gson = Gson()
        val ingredientsType = object : TypeToken<List<String>>() {}.type
        val instructionsType = object : TypeToken<List<String>>() {}.type

        return Recipe(
            id = id,
            name = name,
            image = image,
            cookingTime = cookingTime,
            difficulty = difficulty,
            rating = rating,
            description = description,
            ingredients = gson.fromJson(ingredientsJson, ingredientsType),
            instructions = gson.fromJson(instructionsJson, instructionsType),
            servings = servings,
            isSaved = true,
            savedDate = savedDate,
            createdDate = createdDate
        )
    }

    companion object {
        fun fromRecipe(recipe: Recipe, savedDate: String): SavedRecipeEntity {
            val gson = Gson()
            return SavedRecipeEntity(
                id = recipe.id,
                name = recipe.name,
                image = recipe.image,
                cookingTime = recipe.cookingTime,
                difficulty = recipe.difficulty,
                rating = recipe.rating,
                description = recipe.description,
                ingredientsJson = gson.toJson(recipe.ingredients),
                instructionsJson = gson.toJson(recipe.instructions),
                servings = recipe.servings,
                savedDate = savedDate,
                createdDate = recipe.createdDate
            )
        }
    }
}
