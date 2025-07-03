package com.just_for_fun.recipeapp.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.just_for_fun.recipeapp.MainActivity
import com.just_for_fun.recipeapp.R
import com.just_for_fun.recipeapp.RecipeDetailsActivity
import com.just_for_fun.recipeapp.model.Recipe

class RecipeRecyclerView(requireContext: Context, toList: List<Recipe>) : ListAdapter<Recipe, RecipeRecyclerView.RecipeViewHolder>(DIFF_CALLBACK) {

    companion object {
        private val DIFF_CALLBACK = object : DiffUtil.ItemCallback<Recipe>() {
            override fun areItemsTheSame(oldItem: Recipe, newItem: Recipe): Boolean {
                return oldItem.id == newItem.id
            }

            override fun areContentsTheSame(oldItem: Recipe, newItem: Recipe): Boolean {
                return oldItem == newItem
            }
        }
    }

    inner class RecipeViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val recipeImageView: ImageView = itemView.findViewById(R.id.recipe_layout_image)
        private val recipeTitleView: TextView = itemView.findViewById(R.id.recipe_layout_title)
        private val recipeDateView: TextView = itemView.findViewById(R.id.recipe_layout_date)
        private val recipeTimeView: TextView = itemView.findViewById(R.id.recipe_layout_time)
        private val recipeDifficultyView: TextView = itemView.findViewById(R.id.recipe_layout_difficulty)
        private val recipeRatingView: TextView = itemView.findViewById(R.id.recipe_layout_rating)
        private val recipeSaveButton: ImageButton = itemView.findViewById(R.id.recipe_layout_save)

        fun bind(recipe: Recipe) {
            recipeImageView.setImageResource(recipe.image)
            recipeTitleView.text = recipe.name
            recipeDateView.text = "Saved on ${recipe.savedDate ?: "Unknown date"}"
            recipeTimeView.text = recipe.cookingTime
            recipeDifficultyView.text = recipe.difficulty
            recipeRatingView.text = recipe.rating.toString()

            updateSaveButtonState(recipe)

            recipeSaveButton.setOnClickListener {
                if (MainActivity.isRecipeSaved(recipe.id)) {
                    MainActivity.unsavedRecipe(recipe)
                    recipe.isSaved = false
                    updateSaveButtonState(recipe)
                } else {
                    MainActivity.saveRecipe(recipe)
                    recipe.isSaved = true
                    updateSaveButtonState(recipe)
                }
            }

            itemView.setOnClickListener {
                val intent = Intent(itemView.context, RecipeDetailsActivity::class.java)
                intent.putExtra("recipe_id", recipe.id)
                itemView.context.startActivity(intent)
            }
        }

        private fun updateSaveButtonState(recipe: Recipe) {
            val isSaved = MainActivity.isRecipeSaved(recipe.id)
            if (isSaved) {
                recipeSaveButton.setImageResource(R.drawable.bookmark_added)
                recipeSaveButton.contentDescription = "Remove from saved"
            } else {
                recipeSaveButton.setImageResource(R.drawable.ic_bookmark_filled)
                recipeSaveButton.contentDescription = "Save recipe"
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecipeViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.recipe_layout, parent, false)
        return RecipeViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecipeViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    fun updateRecipes(newRecipes: List<Recipe>) {
        submitList(newRecipes)
    }
}