package com.just_for_fun.recipeapp.fragments

import androidx.fragment.app.Fragment
import com.just_for_fun.recipeapp.R
import android.Manifest
import android.app.AlertDialog
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.FileProvider
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.android.material.textfield.TextInputEditText
import com.just_for_fun.recipeapp.MainActivity
import com.just_for_fun.recipeapp.model.Recipe
import com.just_for_fun.recipeapp.viewmodel.RecipeViewModel
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

class AddRecipeLayout : Fragment(R.layout.add_recipe_layout) {
    companion object {
        private const val CAMERA_PERMISSION_REQUEST_CODE = 101
        private const val TAG = "AddRecipeLayout"
    }

    private var selectedImageUri: Uri? = null

    private lateinit var addRecipeCard: MaterialCardView
    private lateinit var btnCancel: MaterialButton
    private lateinit var btnSaveRecipe: MaterialButton
    private lateinit var imagePlaceholder: LinearLayout
    private lateinit var ivRecipeImagePreview: ImageView
    private lateinit var btnSelectImage: MaterialButton
    private lateinit var etRecipeName: TextInputEditText
    private lateinit var etCookingTime: TextInputEditText
    private lateinit var etServings: TextInputEditText
    private lateinit var etDifficulty: AutoCompleteTextView
    private lateinit var etDescription: TextInputEditText
    private lateinit var etIngredients: TextInputEditText
    private lateinit var etInstructions: TextInputEditText
    private lateinit var etCloseRecipe: ImageButton
    private lateinit var uploadProgressBar: ProgressBar

    private var addRecipeListener: AddRecipeListener? = null
    private val viewModel: RecipeViewModel by activityViewModels()

    interface AddRecipeListener {
        fun onRecipeAdded(recipe: Recipe, imageUri: android.net.Uri?)
    }

    fun setAddRecipeListener(listener: MainActivity?) {
        this.addRecipeListener = listener
    }

    private val pickImage =
        registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
            uri?.let {
                selectedImageUri = it
                ivRecipeImagePreview.setImageURI(it)
                ivRecipeImagePreview.visibility = View.VISIBLE
                imagePlaceholder.visibility = View.GONE
            }
        }

    private val takePicture =
        registerForActivityResult(ActivityResultContracts.TakePicture()) { success ->
            if (success) {
                selectedImageUri?.let {
                    ivRecipeImagePreview.setImageURI(it)
                    ivRecipeImagePreview.visibility = View.VISIBLE
                    imagePlaceholder.visibility = View.GONE
                }
            }
        }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.add_recipe_layout, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        setupClickListeners()
        setupDifficultyDropdown()
        observeUploadState()
        hide()
    }

    private fun initViews(view: View) {
        addRecipeCard = view.findViewById(R.id.add_recipe_card)
        btnCancel = view.findViewById(R.id.btn_cancel)
        btnSaveRecipe = view.findViewById(R.id.btn_save_recipe)
        imagePlaceholder = view.findViewById(R.id.image_placeholder)
        ivRecipeImagePreview = view.findViewById(R.id.iv_recipe_image_preview)
        btnSelectImage = view.findViewById(R.id.btn_add_image)
        etRecipeName = view.findViewById(R.id.et_recipe_name)
        etCookingTime = view.findViewById(R.id.et_cooking_time)
        etServings = view.findViewById(R.id.et_servings)
        etDifficulty = view.findViewById(R.id.et_difficulty)
        etDescription = view.findViewById(R.id.et_description)
        etIngredients = view.findViewById(R.id.et_ingredients)
        etInstructions = view.findViewById(R.id.et_instructions)
        etCloseRecipe = view.findViewById(R.id.btn_close_add_recipe)
        uploadProgressBar = view.findViewById(R.id.upload_progress_bar)
    }

    private fun observeUploadState() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.uploadState.collect { state ->
                when {
                    state.isLoading -> {
                        Log.d(TAG, "🔄 Upload in progress...")
                        showLoadingState(true)
                    }
                    state.isSuccess -> {
                        Log.d(TAG, "✅ Upload completed successfully!")
                        showLoadingState(false)
                        Toast.makeText(requireContext(), "Recipe saved successfully!", Toast.LENGTH_SHORT).show()
                        clearForm()
                        hide()
                        viewModel.resetUploadState()
                    }
                    state.error != null -> {
                        Log.e(TAG, "❌ Upload failed: ${state.error}")
                        showLoadingState(false)
                        Toast.makeText(requireContext(), "Failed to save recipe: ${state.error}", Toast.LENGTH_LONG).show()
                        viewModel.resetUploadState()
                    }
                }
            }
        }
    }

    private fun showLoadingState(isLoading: Boolean) {
        if (isLoading) {
            Log.d(TAG, "📱 Showing loading spinner...")
            uploadProgressBar.visibility = View.VISIBLE
            btnSaveRecipe.isEnabled = false
            btnSaveRecipe.text = "Uploading..."
        } else {
            Log.d(TAG, "📱 Hiding loading spinner...")
            uploadProgressBar.visibility = View.GONE
            btnSaveRecipe.isEnabled = true
            btnSaveRecipe.text = "Save Recipe"
        }
    }

    private fun setupClickListeners() {
        btnCancel.setOnClickListener {
            clearForm()
            hide()
        }

        etCloseRecipe.setOnClickListener {
            clearForm()
            hide()
        }

        btnSaveRecipe.setOnClickListener {
            saveRecipe()
        }

        btnSelectImage.setOnClickListener {
            showImagePickerDialog()
        }
    }

    private fun setupDifficultyDropdown() {
        val difficulties = resources.getStringArray(R.array.difficulty_levels)
        val adapter = ArrayAdapter(
            requireContext(),
            android.R.layout.simple_dropdown_item_1line,
            difficulties
        )
        etDifficulty.setAdapter(adapter)
    }

    private fun showImagePickerDialog() {
        AlertDialog.Builder(requireContext())
            .setTitle("Select Image")
            .setItems(arrayOf("Choose from Gallery", "Take Photo")) { _, which ->
                when (which) {
                    0 -> pickImage.launch("image/*")
                    1 -> checkCameraPermissionAndTakePicture()
                }
            }
            .show()
    }

    private fun checkCameraPermissionAndTakePicture() {
        if (ContextCompat.checkSelfPermission(
                requireContext(),
                Manifest.permission.CAMERA
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                requireActivity(),
                arrayOf(Manifest.permission.CAMERA),
                CAMERA_PERMISSION_REQUEST_CODE
            )
        } else {
            dispatchTakePictureIntent()
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                dispatchTakePictureIntent()
            } else {
                Toast.makeText(requireContext(), "Camera permission denied", Toast.LENGTH_SHORT)
                    .show()
            }
        }
    }

    private fun dispatchTakePictureIntent() {
        val photoFile: File? = try {
            createImageFile()
        } catch (ex: Exception) {
            Log.d("AddRecipeLayout", "Error from AddRecipe :$ex")
            null
        }
        photoFile?.also {
            selectedImageUri = FileProvider.getUriForFile(
                requireContext(),
                "${requireContext().packageName}.fileprovider",
                it
            )
            takePicture.launch(selectedImageUri)
        }
    }

    private fun createImageFile(): File {
        val timeStamp: String =
            SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir: File = requireContext().filesDir
        return File.createTempFile(
            "JPEG_${timeStamp}_", /* prefix */
            ".jpg", /* suffix */
            storageDir /* directory */
        )
    }

    private fun saveRecipe() {
        Log.d(TAG, "🚀 Save recipe button clicked - starting validation...")
        
        val name = etRecipeName.text.toString().trim()
        val cookingTime = etCookingTime.text.toString().trim()
        val servings = etServings.text.toString().trim()
        val difficulty = etDifficulty.text.toString().trim()
        val description = etDescription.text.toString().trim()
        val ingredients = etIngredients.text.toString().trim()
        val instructions = etInstructions.text.toString().trim()

        var isValid = true

        Log.d(TAG, "📝 Validating recipe fields...")

        if (name.isEmpty()) {
            etRecipeName.error = "Recipe name is required"
            isValid = false
            Log.w(TAG, "⚠️ Validation failed: Recipe name is empty")
        } else {
            etRecipeName.error = null
        }

        if (cookingTime.isEmpty()) {
            etCookingTime.error = "Cooking time is required"
            isValid = false
            Log.w(TAG, "⚠️ Validation failed: Cooking time is empty")
        } else {
            etCookingTime.error = null
        }

        if (servings.isEmpty()) {
            etServings.error = "Servings is required"
            isValid = false
            Log.w(TAG, "⚠️ Validation failed: Servings is empty")
        } else {
            etServings.error = null
        }

        if (difficulty.isEmpty()) {
            etDifficulty.error = "Difficulty is required"
            isValid = false
            Log.w(TAG, "⚠️ Validation failed: Difficulty is empty")
        } else {
            etDifficulty.error = null
        }

        if (ingredients.isEmpty()) {
            etIngredients.error = "Ingredients are required"
            isValid = false
            Log.w(TAG, "⚠️ Validation failed: Ingredients are empty")
        } else {
            etIngredients.error = null
        }

        if (instructions.isEmpty()) {
            etInstructions.error = "Instructions are required"
            isValid = false
            Log.w(TAG, "⚠️ Validation failed: Instructions are empty")
        } else {
            etInstructions.error = null
        }

        if (isValid) {
            Log.d(TAG, "✅ Validation passed - creating recipe object...")
            
            val newRecipe = Recipe(
                id = "", // Let the backend assign the ID
                name = name,
                image = "", // Will be set by backend after upload
                cookingTime = cookingTime,
                difficulty = difficulty,
                rating = 0.0f,
                description = description,
                ingredients = ingredients.split("\n").filter { it.isNotBlank() },
                instructions = instructions.split("\n").filter { it.isNotBlank() },
                servings = servings.toIntOrNull() ?: 1,
                isSaved = false,
                createdDate = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).format(Date())
            )

            Log.d(TAG, "📤 Calling upload with recipe: ${newRecipe.name}")
            if (selectedImageUri != null) {
                Log.d(TAG, "🖼️ Image attached: $selectedImageUri")
            } else {
                Log.d(TAG, "ℹ️ No image attached")
            }

            // Use the listener to trigger upload through MainActivity -> ViewModel
            addRecipeListener?.onRecipeAdded(newRecipe, selectedImageUri)
            
        } else {
            Log.w(TAG, "❌ Validation failed - not proceeding with upload")
            Toast.makeText(requireContext(), "Please fill in all required fields", Toast.LENGTH_SHORT).show()
        }
    }

    private fun generateRecipeId(): String {
        return System.currentTimeMillis().toString()
    }

    internal fun clearForm() {
        etRecipeName.text?.clear()
        etCookingTime.text?.clear()
        etServings.text?.clear()
        etDifficulty.text?.clear()
        etDescription.text?.clear()
        etIngredients.text?.clear()
        etInstructions.text?.clear()

        selectedImageUri = null
        ivRecipeImagePreview.visibility = View.GONE
        imagePlaceholder.visibility = View.VISIBLE

        // Clear errors
        etRecipeName.error = null
        etCookingTime.error = null
        etServings.error = null
        etDifficulty.error = null
        etIngredients.error = null
        etInstructions.error = null
    }

    fun show() {
        view?.visibility = View.VISIBLE
        addRecipeCard.translationY = addRecipeCard.height.toFloat()
        addRecipeCard.alpha = 1f
        addRecipeCard.animate()
            .translationY(0f)
            .setInterpolator(AccelerateDecelerateInterpolator())
            .setDuration(1200)
            .start()
    }

    fun hide() {
        addRecipeCard.animate()
            .translationY(addRecipeCard.height.toFloat()) // Slide down
            .alpha(1f)
            .setInterpolator(AccelerateDecelerateInterpolator())
            .setDuration(1200)
            .withEndAction {
                view?.visibility = View.GONE
                addRecipeCard.translationY = 0f
            }
            .start()
    }
}
