package com.just_for_fun.recipeapp

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.just_for_fun.recipeapp.adapter.IngredientsAdapter
import com.just_for_fun.recipeapp.adapter.InstructionsAdapter
import com.just_for_fun.recipeapp.model.Recipe

class RecipeDetailsActivity : AppCompatActivity() {

    private lateinit var recipe: Recipe
    private lateinit var recipeSaveButton: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.recipe_details)

        val recipeId = intent.getIntExtra("recipe_id", -1)
        if (recipeId == -1) {
            Toast.makeText(this, "Recipe not found", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        recipe = Recipe.getSampleRecipes().find { it.id == recipeId } ?: run {
            Toast.makeText(this, "Recipe not found", Toast.LENGTH_SHORT).show()

            finish()
            return
        }

        setupViews()
        setupToolbar()
        populateRecipeData()
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

        recipeImage.setImageResource(recipe.image)
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
        if (MainActivity.isRecipeSaved(recipe.id)) {
            MainActivity.unsavedRecipe(recipe)
            recipe.isSaved = false
        } else {
            MainActivity.saveRecipe(recipe)
            recipe.isSaved = true
        }
        updateSaveButtonState()
    }

    private fun updateSaveButtonState() {
        val isSaved = MainActivity.isRecipeSaved(recipe.id)
        if (isSaved) {
            recipeSaveButton.setImageResource(R.drawable.bookmark_added)
            recipeSaveButton.contentDescription = "Remove from saved"
        } else {
            recipeSaveButton.setImageResource(R.drawable.ic_bookmark_filled)
            recipeSaveButton.contentDescription = "Save recipe"
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