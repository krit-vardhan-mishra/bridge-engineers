package com.just_for_fun.recipeapp.network

import com.just_for_fun.recipeapp.model.Recipe
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface RecipeApiService {
    @GET("api/recipes")
    suspend fun getRecipes(): List<Recipe>

    @POST("api/recipes")
    suspend fun createRecipe(@Body recipe: Recipe): Recipe

    @GET("api/recipes/{id}")
    suspend fun getRecipe(@Path("id") id: String): Recipe

    @PUT("api/recipes/{id}")
    suspend fun updateRecipe(@Path("id") id: String, @Body recipe: Recipe): Recipe

    @DELETE("api/recipes/{id}")
    suspend fun deleteRecipe(@Path("id") id: String)
}

object RetrofitClient {
    private const val BASE_URL = "https://recipe-app-backend-okfqufevt-krit-vardhan-mishras-projects.vercel.app/"

    val apiService: RecipeApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(RecipeApiService::class.java)
    }
}
