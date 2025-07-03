import { Schema, model } from 'mongoose';

const recipeSchema = new Schema({
  name: { type: String, required: true },
  isSaved: { type: Boolean, default: false },
  image: {type: Int32Array, default: 0},
});

// Use static, not method
recipeSchema.statics.findIsSavedByName = async function(name) {
  const recipe = await this.findOne({ name });
  return recipe ? recipe.isSaved : null;
};

const Recipe = model('Recipe', recipeSchema);
export default Recipe;