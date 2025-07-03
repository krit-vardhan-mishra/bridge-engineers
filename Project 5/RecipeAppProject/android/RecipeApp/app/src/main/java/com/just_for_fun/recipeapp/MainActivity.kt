package com.just_for_fun.recipeapp

import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.AutoCompleteTextView
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import androidx.fragment.app.Fragment
import com.just_for_fun.recipeapp.fragments.AddRecipeLayout
import com.just_for_fun.recipeapp.fragments.RecipeFragment
import com.just_for_fun.recipeapp.fragments.SavedFragment
import com.just_for_fun.recipeapp.model.Recipe
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import androidx.core.view.isVisible

class MainActivity : AppCompatActivity(), AddRecipeLayout.AddRecipeListener {

    private lateinit var searchView: SearchView
    private lateinit var searchIcon: ImageView
    private lateinit var titleText: TextView
    private lateinit var topBar: View
    private lateinit var recipesTab: TextView
    private lateinit var savedTab: TextView

    companion object {
        val allRecipes = Recipe.getSampleRecipes().toMutableList()
        val savedRecipes = mutableListOf<Recipe>()

        fun saveRecipe(recipe: Recipe) {
            if (!savedRecipes.any { it.id == recipe.id }) {
                val currentDate =
                    LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
                val savedRecipe = recipe.copy(isSaved = true, savedDate = currentDate)
                savedRecipes.add(savedRecipe)
                allRecipes.find { it.id == recipe.id }?.isSaved = true
            }
        }

        fun unsavedRecipe(recipe: Recipe) {
            savedRecipes.removeAll { it.id == recipe.id }
            allRecipes.find { it.id == recipe.id }?.isSaved = false
        }

        fun isRecipeSaved(recipeId: Int): Boolean {
            return savedRecipes.any { it.id == recipeId }
        }

        fun addToSaved(recipe: Recipe) {
            saveRecipe(recipe)
            allRecipes.find { it.id == recipe.id }?.isSaved = true
        }

        fun removeFromSaved(recipeId: Int) {
            val recipe = savedRecipes.find { it.id == recipeId }
            recipe?.let {
                unsavedRecipe(it)
                allRecipes.find { r -> r.id == recipeId }?.isSaved = false
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.top_bar)) { view, insets ->
            val statusBarInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            view.updatePadding(top = statusBarInsets.top)
            insets
        }

        initializeViews()
        setupSearchView()
        setupTabNavigation()

        loadFragment(RecipeFragment())
        updateTabSelection(recipesTab)
    }

    private fun initializeViews() {
        searchView = findViewById(R.id.search_view)
        searchIcon = findViewById(R.id.search_icon)
        titleText = findViewById(R.id.title_text)
        topBar = findViewById(R.id.top_bar)
        recipesTab = findViewById(R.id.recipes_tab)
        savedTab = findViewById(R.id.saved_tab)
    }

    private fun setupSearchView() {
        val searchAutoComplete = searchView.findViewById<AutoCompleteTextView>(
            androidx.appcompat.R.id.search_src_text
        )
        searchAutoComplete.hint = getString(R.string.search_hint)
        searchAutoComplete.setHintTextColor(Color.GRAY)
        searchAutoComplete.setTextColor(Color.BLACK)

        searchIcon.setOnClickListener {
            showSearchView()
        }

        searchView.setOnCloseListener {
            hideSearchView()
            false
        }

        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                performSearch(query)
                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                if (newText.isNullOrEmpty()) {
                    resetSearch()
                } else {
                    performSearch(newText)
                }
                return true
            }
        })
    }

    private fun setupTabNavigation() {
        recipesTab.setOnClickListener {
            loadFragment(RecipeFragment())
            updateTabSelection(recipesTab)
        }

        savedTab.setOnClickListener {
            loadFragment(SavedFragment())
            updateTabSelection(savedTab)
        }
    }

    private fun showSearchView() {
        topBar.visibility = View.GONE
        searchView.visibility = View.VISIBLE
        searchView.requestFocus()
    }

    private fun hideSearchView() {
        searchView.visibility = View.GONE
        topBar.visibility = View.VISIBLE
        searchView.setQuery("", false)
        resetSearch()
    }

    private fun performSearch(query: String?) {
        query?.let {
            val currentFragment = supportFragmentManager.findFragmentById(R.id.fragment)
            when (currentFragment) {
                is RecipeFragment -> currentFragment.searchRecipes(it)
                is SavedFragment -> currentFragment.searchSavedRecipes(it)
            }
        }
    }

    fun switchToRecipesTab() {
        loadFragment(RecipeFragment())
        updateTabSelection(recipesTab)
    }

    private fun resetSearch() {
        val currentFragment = supportFragmentManager.findFragmentById(R.id.fragment)
        when (currentFragment) {
            is RecipeFragment -> currentFragment.resetSearch()
            is SavedFragment -> currentFragment.resetSearch()
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment, fragment)
            .commit()
    }

    private fun updateTabSelection(selectedTab: TextView) {
        recipesTab.isSelected = false
        savedTab.isSelected = false

        selectedTab.isSelected = true
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        val addRecipeLayout =
            supportFragmentManager.findFragmentById(R.id.add_recipe_container) as? AddRecipeLayout
        if (addRecipeLayout != null && addRecipeLayout.view?.visibility == View.VISIBLE) {
            addRecipeLayout.hide()
            addRecipeLayout.clearForm()
        } else if (searchView.isVisible) {
            hideSearchView()
        } else {
            super.onBackPressed()
        }
    }

    override fun onRecipeAdded(recipe: Recipe) {
        allRecipes.add(recipe)
        refreshRecipeFragment()
    }

    private fun refreshRecipeFragment() {
        supportFragmentManager.findFragmentById(R.id.fragment)?.let {
            if (it is RecipeFragment) it.loadRecipes()
        }
    }
}