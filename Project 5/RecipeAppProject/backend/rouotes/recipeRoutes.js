import { Router } from 'express';
import { addRecipe, getRecipes } from '../controllers/recipeController.js';

const router = Router();
router.post('/recipes', addRecipe);
router.get('/recipes', getRecipes);

export default router;