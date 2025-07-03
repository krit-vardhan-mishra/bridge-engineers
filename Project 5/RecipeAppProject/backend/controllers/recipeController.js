import Recipe from '../models/Recipe.js';

export async function addRecipe(req, res) {
  const { name, isSaved } = req.body;
  try {
    const newRecipe = new Recipe({ name, isSaved });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRecipes(req, res) {
  try {
    const isSaved = await Recipe.findIsSavedByName(req.query.name); 
    res.status(200).json({ isSaved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
