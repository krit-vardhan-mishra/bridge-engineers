const mongoose = require('mongoose');
require('dotenv').config();

// Simple connection test
const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipeapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connection successful');
    
    // Test creating a sample recipe
    const Recipe = mongoose.model('Recipe', new mongoose.Schema({
      name: { type: String, required: true },
      image: String,
      cookingTime: { type: String, required: true },
      difficulty: { type: String, required: true },
      rating: { type: Number, default: 0 },
      description: String,
      ingredients: [String],
      instructions: [String],
      servings: { type: Number, default: 1 },
      createdDate: { type: Date, default: Date.now }
    }));

    const count = await Recipe.countDocuments();
    console.log(`📊 Current recipes in database: ${count}`);
    
    if (count === 0) {
      console.log('📝 Database is empty - this is expected for a new setup');
    }
    
    mongoose.connection.close();
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
