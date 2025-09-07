package com.just_for_fun.recipeapp.network

import com.just_for_fun.recipeapp.BuildConfig
import com.just_for_fun.recipeapp.model.Recipe
import okhttp3.HttpUrl
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
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
    // Set to true for production environment, false for local development
    private const val USE_PRODUCTION = true

    // Local development URL (for Android emulator)
    private const val DEVELOPMENT_BASE_URL = "http://10.0.2.2:3000/api/"

    // Use appropriate base URL based on environment setting
    private val BASE_URL = if (USE_PRODUCTION) BuildConfig.PRODUCTION_BASE_URL else DEVELOPMENT_BASE_URL

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(VercelAuthBypassInterceptor())
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
