package com.just_for_fun.recipeapp.database

import androidx.room.*

@Dao
interface SavedRecipeDao {
    @Query("SELECT * FROM saved_recipes")
    suspend fun getAllSavedRecipes(): List<SavedRecipeEntity>

    @Query("SELECT * FROM saved_recipes WHERE id = :id")
    suspend fun getSavedRecipeById(id: String): SavedRecipeEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSavedRecipe(recipe: SavedRecipeEntity)

    @Delete
    suspend fun deleteSavedRecipe(recipe: SavedRecipeEntity)

    @Query("DELETE FROM saved_recipes WHERE id = :id")
    suspend fun deleteSavedRecipeById(id: String)
}
