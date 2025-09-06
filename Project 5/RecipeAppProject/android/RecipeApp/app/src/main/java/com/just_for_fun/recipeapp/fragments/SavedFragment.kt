package com.just_for_fun.recipeapp.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.button.MaterialButton
import com.just_for_fun.recipeapp.MainActivity
import com.just_for_fun.recipeapp.R
import com.just_for_fun.recipeapp.adapter.RecipeSavedRecyclerView
import com.just_for_fun.recipeapp.viewmodel.RecipeViewModel
import kotlinx.coroutines.launch

class SavedFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: RecipeSavedRecyclerView
    private lateinit var emptyStateSaved: LinearLayout
    private lateinit var btnExploreRecipes: MaterialButton

    private val viewModel: RecipeViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_saved, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initViews(view)
        setupRecyclerView()
        setupEmptyState()
        observeSavedRecipes()
    }

    override fun onResume() {
        super.onResume()
        loadSavedRecipes()
    }

    private fun initViews(view: View) {
        recyclerView = view.findViewById(R.id.recipe_saved_recycler_view)
        emptyStateSaved = view.findViewById(R.id.empty_state_saved)
        btnExploreRecipes = view.findViewById(R.id.btn_explore_recipes)
    }

    private fun setupRecyclerView() {
        adapter = RecipeSavedRecyclerView(onUnsaveToggle = { recipe ->
            viewModel.removeSavedRecipe(recipe.id)
        })
        recyclerView.adapter = adapter
        recyclerView.layoutManager = GridLayoutManager(requireContext(), 1)

        val spacing = resources.getDimensionPixelSize(R.dimen.grid_spacing)
        recyclerView.addItemDecoration(GridSpacingItemDecoration(1, spacing, true))
    }

    private fun setupEmptyState() {
        btnExploreRecipes.setOnClickListener {
            (requireActivity() as? MainActivity)?.switchToRecipesTab()
        }
    }

    private fun observeSavedRecipes() {
        lifecycleScope.launch {
            viewModel.savedRecipes.collect { savedRecipes ->
                adapter.submitList(savedRecipes)
                updateEmptyState(savedRecipes.isEmpty())
            }
        }
    }

    fun resetSearch() {
        val currentSaved = viewModel.savedRecipes.value
        adapter.submitList(currentSaved)
        updateEmptyState(currentSaved.isEmpty())
    }

    private fun loadSavedRecipes() {
        // Saved recipes are now observed via ViewModel
    }

    fun searchSavedRecipes(query: String) {
        val currentSaved = viewModel.savedRecipes.value
        val filteredList = currentSaved.filter {
            it.name.contains(query, ignoreCase = true) ||
                    it.description.contains(query, ignoreCase = true)
        }
        adapter.submitList(filteredList)
        updateEmptyState(filteredList.isEmpty())
    }

    private fun updateEmptyState(isEmpty: Boolean) {
        if (isEmpty) {
            emptyStateSaved.visibility = View.VISIBLE
            recyclerView.visibility = View.GONE
        } else {
            emptyStateSaved.visibility = View.GONE
            recyclerView.visibility = View.VISIBLE
        }
    }

    inner class GridSpacingItemDecoration(
        private val spanCount: Int,
        private val spacing: Int,
        private val includeEdge: Boolean
    ) : RecyclerView.ItemDecoration() {

        override fun getItemOffsets(
            outRect: android.graphics.Rect,
            view: View,
            parent: RecyclerView,
            state: RecyclerView.State
        ) {
            val position = parent.getChildAdapterPosition(view)
            val column = position % spanCount

            if (includeEdge) {
                outRect.left = spacing - column * spacing / spanCount
                outRect.right = (column + 1) * spacing / spanCount

                if (position < spanCount) {
                    outRect.top = spacing
                }
                outRect.bottom = spacing
            } else {
                outRect.left = column * spacing / spanCount
                outRect.right = spacing - (column + 1) * spacing / spanCount
                if (position >= spanCount) {
                    outRect.top = spacing
                }
            }
        }
    }
}