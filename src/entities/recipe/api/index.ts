// Server-side API
export {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from './server';

// Server Actions
export {
  createRecipeAction,
  updateRecipeAction,
  deleteRecipeAction,
} from './actions';

// Client-side React Query hooks
export {
  useRecipes,
  useRecipe,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
  recipeKeys,
} from './hooks';

// Re-export types for convenience
export type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
