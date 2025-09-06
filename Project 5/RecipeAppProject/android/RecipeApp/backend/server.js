
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadOnCloudinary } = require('./cloudinary.js');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

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

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  name: String,
  image: String, // URL instead of Int
  cookingTime: String,
  difficulty: String,
  rating: Number,
  description: String,
  ingredients: [String],
  instructions: [String],
  servings: Number,
  createdDate: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Routes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create recipe with image upload
app.post('/api/recipes', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const localPath = path.resolve(req.file.path);
      const uploadResult = await uploadOnCloudinary(localPath);
      if (uploadResult && uploadResult.url) {
        imageUrl = uploadResult.url;
      }
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }
    const recipeData = {
      ...req.body,
      image: imageUrl,
    };
    const recipe = new Recipe(recipeData);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update recipe with image upload
app.put('/api/recipes/:id', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.image;
    if (req.file) {
      const localPath = path.resolve(req.file.path);
      const uploadResult = await uploadOnCloudinary(localPath);
      if (uploadResult && uploadResult.url) {
        imageUrl = uploadResult.url;
      }
    }
    const updateData = {
      ...req.body,
      image: imageUrl,
    };
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
