package com.just_for_fun.recipeapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.just_for_fun.recipeapp.R
import com.just_for_fun.recipeapp.adapter.IngredientsAdapter
import com.just_for_fun.recipeapp.adapter.InstructionsAdapter
import com.just_for_fun.recipeapp.model.Recipe
import com.just_for_fun.recipeapp.viewmodel.RecipeViewModel
import kotlinx.coroutines.launch

class RecipeDetailsActivity : AppCompatActivity() {

    private lateinit var recipe: Recipe
    private lateinit var recipeSaveButton: ImageButton
    private lateinit var viewModel: RecipeViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.recipe_details)

        viewModel = ViewModelProvider(this)[RecipeViewModel::class.java]

        val recipeId = intent.getStringExtra("recipe_id")
        if (recipeId == null) {
            Toast.makeText(this, "Recipe not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        lifecycleScope.launch {
            loadRecipe(recipeId)
        }
    }

    private suspend fun loadRecipe(recipeId: String) {
        // First check saved recipes
        val savedRecipe = viewModel.savedRecipes.value.find { it.id == recipeId }
        if (savedRecipe != null) {
            recipe = savedRecipe
            setupViews()
            setupToolbar()
            populateRecipeData()
            return
        }

        // Then check all recipes
        val allRecipe = viewModel.recipes.value.find { it.id == recipeId }
        if (allRecipe != null) {
            recipe = allRecipe
            setupViews()
            setupToolbar()
            populateRecipeData()
            return
        }

        // If not found locally, fetch from backend
        try {
            val fetchedRecipe = viewModel.getRecipeById(recipeId)
            if (fetchedRecipe != null) {
                recipe = fetchedRecipe
                setupViews()
                setupToolbar()
                populateRecipeData()
                return
            }
        } catch (e: Exception) {
            Log.e("RecipeDetailsActivity", "Error fetching recipe from backend: ${e.message}", e)
        }

        // If not found anywhere, show error
        Toast.makeText(this, "Recipe not found", Toast.LENGTH_SHORT).show()
        finish()
    }

    private fun setupViews() {
        recipeSaveButton = findViewById(R.id.recipe_save_button)

        recipeSaveButton.setOnClickListener {
            toggleSaveRecipe()
        }
    }

    private fun setupToolbar() {
        val backButton: ImageButton = findViewById(R.id.back_button)
        val shareButton: ImageButton = findViewById(R.id.share_button)
        val toolbarTitle: TextView = findViewById(R.id.toolbar_title)

        toolbarTitle.text = recipe.name

        backButton.setOnClickListener {
            onBackPressed()
        }

        shareButton.setOnClickListener {
            shareRecipe()
        }
    }

    private fun populateRecipeData() {
        val recipeImage: ImageView = findViewById(R.id.recipe_image)
        val recipeTitle: TextView = findViewById(R.id.recipe_title)
        val recipeTime: TextView = findViewById(R.id.recipe_time)
        val recipeDifficulty: TextView = findViewById(R.id.recipe_difficulty)
        val recipeServings: TextView = findViewById(R.id.recipe_servings)
        val recipeRating: TextView = findViewById(R.id.recipe_rating)
        val recipeDescription: TextView = findViewById(R.id.recipe_description)
        val ingredientsSection: LinearLayout = findViewById(R.id.ingredients_section)
        val instructionsSection: LinearLayout = findViewById(R.id.instructions_section)

        // Load image from URL or use placeholder
        if (recipe.image.isNotEmpty()) {
            Glide.with(this)
                .load(recipe.image)
                .placeholder(R.drawable.lava_cake)
                .error(R.drawable.lava_cake)
                .centerCrop()
                .into(recipeImage)
        } else {
            recipeImage.setImageResource(R.drawable.lava_cake)
        }
        recipeTitle.text = recipe.name
        recipeTime.text = recipe.cookingTime
        recipeDifficulty.text = recipe.difficulty
        recipeServings.text = recipe.servings.toString()
        recipeRating.text = recipe.rating.toString()
        recipeDescription.text = recipe.description

        updateSaveButtonState()

        if (recipe.ingredients.isNotEmpty()) {
            ingredientsSection.visibility = View.VISIBLE
            setupIngredientsRecyclerView()
        }

        if (recipe.instructions.isNotEmpty()) {
            instructionsSection.visibility = View.VISIBLE
            setupInstructionsRecyclerView()
        }
    }

    private fun setupIngredientsRecyclerView() {
        val ingredientsRecyclerView: RecyclerView = findViewById(R.id.ingredients_recycler_view)
        val ingredientsAdapter = IngredientsAdapter(recipe.ingredients)

        ingredientsRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@RecipeDetailsActivity)
            adapter = ingredientsAdapter
        }
    }

    private fun setupInstructionsRecyclerView() {
        val instructionsRecyclerView: RecyclerView = findViewById(R.id.instructions_recycler_view)
        val instructionsAdapter = InstructionsAdapter(recipe.instructions)

        instructionsRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@RecipeDetailsActivity)
            adapter = instructionsAdapter
        }
    }

    private fun toggleSaveRecipe() {
        lifecycleScope.launch {
            val isSaved = viewModel.isRecipeSaved(recipe.id)
            if (isSaved) {
                viewModel.removeSavedRecipe(recipe.id)
                recipe.isSaved = false
            } else {
                viewModel.saveRecipe(recipe)
                recipe.isSaved = true
            }
            updateSaveButtonState()
        }
    }

    private fun updateSaveButtonState() {
        lifecycleScope.launch {
            val isSaved = viewModel.isRecipeSaved(recipe.id)
            if (isSaved) {
                recipeSaveButton.setImageResource(R.drawable.bookmark_added)
                recipeSaveButton.contentDescription = "Remove from saved"
            } else {
                recipeSaveButton.setImageResource(R.drawable.ic_bookmark_filled)
                recipeSaveButton.contentDescription = "Save recipe"
            }
        }
    }

    private fun shareRecipe() {
        val shareText = buildString {
            append("Check out this amazing recipe: ${recipe.name}\n\n")
            append("Cooking Time: ${recipe.cookingTime}\n")
            append("Difficulty: ${recipe.difficulty}\n")
            append("Rating: ${recipe.rating}⭐\n\n")
            append("Description: ${recipe.description}\n\n")

            if (recipe.ingredients.isNotEmpty()) {
                append("Ingredients:\n")
                recipe.ingredients.forEachIndexed { index, ingredient ->
                    append("${index + 1}. $ingredient\n")
                }
                append("\n")
            }

            if (recipe.instructions.isNotEmpty()) {
                append("Instructions:\n")
                recipe.instructions.forEachIndexed { index, instruction ->
                    append("${index + 1}. $instruction\n")
                }
            }
        }

        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, shareText)
            putExtra(Intent.EXTRA_SUBJECT, "Recipe: ${recipe.name}")
        }

        startActivity(Intent.createChooser(shareIntent, "Share Recipe"))
    }
}