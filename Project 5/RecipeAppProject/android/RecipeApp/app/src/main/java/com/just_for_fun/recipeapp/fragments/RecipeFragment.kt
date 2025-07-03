package com.just_for_fun.recipeapp.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.just_for_fun.recipeapp.MainActivity
import com.just_for_fun.recipeapp.R
import com.just_for_fun.recipeapp.adapter.RecipeRecyclerView

class RecipeFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: RecipeRecyclerView
    private lateinit var fabAddRecipe: FloatingActionButton
    private lateinit var emptyState: LinearLayout
    private lateinit var addRecipeLayout: AddRecipeLayout

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_recipe, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        setupRecyclerView()
        setupFab()
        loadRecipes()

        // Initialize AddRecipeLayout
        addRecipeLayout = childFragmentManager.findFragmentByTag("AddRecipeLayoutTag") as? AddRecipeLayout
            ?: AddRecipeLayout().also {
                childFragmentManager.beginTransaction()
                    .add(R.id.add_recipe_container, it, "AddRecipeLayoutTag")
                    .commit()
                Log.d("RecipeFragment", "AddRecipeLayout added")
            }
        addRecipeLayout.setAddRecipeListener(activity as? MainActivity)
    }

    private fun initViews(view: View) {
        recyclerView = view.findViewById(R.id.recipe_recycler_view)
        fabAddRecipe = view.findViewById(R.id.fab_add_recipe)
        emptyState = view.findViewById(R.id.empty_state)
    }

    private fun setupRecyclerView() {
        adapter = RecipeRecyclerView(requireContext(), MainActivity.allRecipes.toList())
        recyclerView.layoutManager = GridLayoutManager(requireContext(), 1)
        recyclerView.adapter = adapter

        val spacingInPixels = resources.getDimensionPixelSize(R.dimen.grid_spacing)
        recyclerView.addItemDecoration(GridSpacingItemDecoration(1, spacingInPixels, true))
    }

    private fun setupFab() {
        fabAddRecipe.setOnClickListener {
            addRecipeLayout.show()
        }
    }

    fun loadRecipes() {
        adapter.updateRecipes(MainActivity.allRecipes.toList())
        updateEmptyState(MainActivity.allRecipes.isEmpty())
    }

    fun searchRecipes(query: String) {
        val filteredList = MainActivity.allRecipes.filter {
            it.name.contains(query, ignoreCase = true) ||
                    it.description.contains(query, ignoreCase = true) ||
                    it.ingredients.any { ingredient -> ingredient.contains(query, ignoreCase = true) }
        }
        adapter.updateRecipes(filteredList)
        updateEmptyState(filteredList.isEmpty())
    }

    fun resetSearch() {
        adapter.updateRecipes(MainActivity.allRecipes.toList())
        updateEmptyState(MainActivity.allRecipes.isEmpty())
    }

    private fun updateEmptyState(isEmpty: Boolean) {
        if (isEmpty) {
            emptyState.visibility = View.VISIBLE
            recyclerView.visibility = View.GONE
        } else {
            emptyState.visibility = View.GONE
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