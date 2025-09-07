package com.just_for_fun.recipeapp.network

import com.just_for_fun.recipeapp.BuildConfig
import com.just_for_fun.recipeapp.model.Recipe
import okhttp3.HttpUrl
import okhttp3.Interceptor
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.RequestBody
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

import com.just_for_fun.recipeapp.model.NewRecipeRequest

interface RecipeApiService {
    @GET("api/recipes")
    suspend fun getRecipes(): List<Recipe>

    @POST("api/recipes")
    suspend fun createRecipe(@Body recipe: NewRecipeRequest): Recipe

    @Multipart
    @POST("api/recipes")
    suspend fun createRecipeWithImage(
        @Part("name") name: RequestBody,
        @Part("cookingTime") cookingTime: RequestBody,
        @Part("difficulty") difficulty: RequestBody,
        @Part("description") description: RequestBody,
        @Part("ingredients") ingredients: RequestBody,
        @Part("instructions") instructions: RequestBody,
        @Part("servings") servings: RequestBody,
        @Part("rating") rating: RequestBody,
        @Part("createdDate") createdDate: RequestBody,
        @Part image: MultipartBody.Part?
    ): Recipe

    @GET("api/recipes/{id}")
    suspend fun getRecipe(@Path("id") id: String): Recipe

    @PUT("api/recipes/{id}")
    suspend fun updateRecipe(@Path("id") id: String, @Body recipe: Recipe): Recipe

    @DELETE("api/recipes/{id}")
    suspend fun deleteRecipe(@Path("id") id: String)
}

/**
 * Interceptor to add Vercel authentication bypass parameters to all requests
 */
class VercelAuthBypassInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val originalUrl = originalRequest.url
        
        // Add authentication bypass parameters if they exist
        val authBypass = BuildConfig.VERCEL_AUTH_BYPASS
        if (authBypass.isNotEmpty()) {
            // Parse the bypass parameters
            val bypassParams = authBypass.removePrefix("?").split("&")
            var urlBuilder = originalUrl.newBuilder()
            
            bypassParams.forEach { param ->
                val keyValue = param.split("=")
                if (keyValue.size == 2) {
                    urlBuilder = urlBuilder.addQueryParameter(keyValue[0], keyValue[1])
                }
            }
            
            val newRequest = originalRequest.newBuilder()
                .url(urlBuilder.build())
                .build()
            
            return chain.proceed(newRequest)
        }
        
        return chain.proceed(originalRequest)
    }
}

object RetrofitClient {
    // Use appropriate base URL based on environment setting
    private val BASE_URL = BuildConfig.PRODUCTION_BASE_URL

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(1, java.util.concurrent.TimeUnit.MINUTES)
        .readTimeout(1, java.util.concurrent.TimeUnit.MINUTES)
        .writeTimeout(1, java.util.concurrent.TimeUnit.MINUTES)
        .addInterceptor(VercelAuthBypassInterceptor())
        .addInterceptor(com.just_for_fun.recipeapp.debug.ApiLogger.createLoggingInterceptor())
        .build()

    val apiService: RecipeApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(RecipeApiService::class.java)
    }
}
