package com.just_for_fun.recipeapp.network

import com.just_for_fun.recipeapp.model.Recipe
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface RecipeApiService {
    @GET("recipes")
    suspend fun getRecipes(): List<Recipe>

    @POST("recipes")
    suspend fun createRecipe(@Body recipe: Recipe): Recipe

    @GET("recipes/{id}")
    suspend fun getRecipe(@Path("id") id: String): Recipe

    @PUT("recipes/{id}")
    suspend fun updateRecipe(@Path("id") id: String, @Body recipe: Recipe): Recipe

    @DELETE("recipes/{id}")
    suspend fun deleteRecipe(@Path("id") id: String)
}

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:3000/api/" // For Android emulator

    val apiService: RecipeApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(RecipeApiService::class.java)
    }
}
