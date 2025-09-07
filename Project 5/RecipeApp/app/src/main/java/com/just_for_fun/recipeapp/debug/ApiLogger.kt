package com.just_for_fun.recipeapp.debug

import android.util.Log
import okhttp3.logging.HttpLoggingInterceptor

/**
 * Custom logging interceptor for HTTP requests
 * Provides detailed, formatted logging for API requests and responses
 */
object ApiLogger {
    // Create a logging interceptor for HTTP requests
    fun createLoggingInterceptor(): HttpLoggingInterceptor {
        val logging = HttpLoggingInterceptor { message ->
            Log.d("ApiLogger", message)
        }
        
        // Set the desired log level
        logging.level = HttpLoggingInterceptor.Level.BODY
        
        return logging
    }
}
