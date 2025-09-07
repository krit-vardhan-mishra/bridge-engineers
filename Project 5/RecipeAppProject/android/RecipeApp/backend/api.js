const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { uploadOnCloudinary } = require('./cloudinary.js');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://10.0.2.2:3000', 'https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer setup for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Recipe Schema
const recipeSchema = new mongoose.Schema({
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
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Connect to MongoDB Atlas
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB Atlas connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// API Routes
app.get('/recipes', async (req, res) => {
  try {
    await connectToDatabase();
    const recipes = await Recipe.find().sort({ createdDate: -1 });
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/recipes', upload.single('image'), async (req, res) => {
  console.log('📥 Starting recipe creation process...');
  console.log('📋 Recipe data received:', { 
    name: req.body.name, 
    hasFile: !!req.file,
    fileName: req.file?.originalname 
  });
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectToDatabase();
    console.log('✅ MongoDB connection successful');
    
    let imageUrl = '';
    if (req.file) {
      console.log('🖼️ Image file detected, starting Cloudinary upload...');
      console.log('📁 Local file path:', req.file.path);
      
      const localPath = path.resolve(req.file.path);
      console.log('☁️ Uploading to Cloudinary...');
      
      const uploadResult = await uploadOnCloudinary(localPath);
      if (uploadResult && uploadResult.url) {
        imageUrl = uploadResult.url;
        console.log('✅ Cloudinary upload successful:', imageUrl);
      } else {
        console.log('❌ Cloudinary upload failed - no URL returned');
      }
    } else if (req.body.image) {
      imageUrl = req.body.image;
      console.log('🔗 Using provided image URL:', imageUrl);
    } else {
      console.log('ℹ️ No image provided for recipe');
    }

    const recipeData = { ...req.body, image: imageUrl };
    console.log('📝 Processing recipe data...');

    // Parse ingredients and instructions if they are strings (from form-data)
    if (typeof recipeData.ingredients === 'string') {
      try {
        recipeData.ingredients = JSON.parse(recipeData.ingredients);
        console.log('✅ Ingredients parsed as JSON');
      } catch (e) {
        // If parsing fails, split by newlines
        recipeData.ingredients = recipeData.ingredients.split('\n').filter(item => item.trim());
        console.log('✅ Ingredients parsed as text lines');
      }
    }
    if (typeof recipeData.instructions === 'string') {
      try {
        recipeData.instructions = JSON.parse(recipeData.instructions);
        console.log('✅ Instructions parsed as JSON');
      } catch (e) {
        // If parsing fails, split by newlines
        recipeData.instructions = recipeData.instructions.split('\n').filter(item => item.trim());
        console.log('✅ Instructions parsed as text lines');
      }
    }

    console.log('💾 Saving recipe to MongoDB...');
    const recipe = new Recipe(recipeData);
    await recipe.save();
    console.log('✅ Recipe saved successfully to MongoDB with ID:', recipe._id);
    
    res.status(201).json(recipe);
    console.log('🎉 Recipe creation process completed successfully');
  } catch (err) {
    console.error('❌ Error creating recipe:', err.message);
    console.error('🔍 Full error details:', err);
    res.status(400).json({ error: err.message });
  }
});
app.get('/recipes/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/recipes/:id', upload.single('image'), async (req, res) => {
  try {
    await connectToDatabase();
    
    let imageUrl = req.body.image;
    if (req.file) {
      const localPath = path.resolve(req.file.path);
      const uploadResult = await uploadOnCloudinary(localPath);
      if (uploadResult && uploadResult.url) {
        imageUrl = uploadResult.url;
      }
    }

    const updateData = { ...req.body, image: imageUrl };
    
    // Parse ingredients and instructions if they are strings
    if (typeof updateData.ingredients === 'string') {
      try {
        updateData.ingredients = JSON.parse(updateData.ingredients);
      } catch (e) {
        updateData.ingredients = updateData.ingredients.split('\n').filter(item => item.trim());
      }
    }
    if (typeof updateData.instructions === 'string') {
      try {
        updateData.instructions = JSON.parse(updateData.instructions);
      } catch (e) {
        updateData.instructions = updateData.instructions.split('\n').filter(item => item.trim());
      }
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Recipe API is running', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Recipe App API', version: '1.0.0' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// For Vercel, export the app
module.exports = app;
