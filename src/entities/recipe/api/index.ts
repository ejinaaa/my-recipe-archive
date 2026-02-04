// Server-side API
export {
  getRecipes,
  getRecipe,
  getRecipesPaginated,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from './server';

// Server Actions
export {
  getRecipesAction,
  getRecipeAction,
  getRecipesPaginatedAction,
  createRecipeAction,
  updateRecipeAction,
  deleteRecipeAction,
} from './actions';

// Client-side React Query hooks
export {
  useRecipes,
  useRecipe,
  useInfiniteRecipes,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
  recipeKeys,
} from './hooks';

// Re-export types for convenience
export type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
export type { GetRecipesParams, PaginatedRecipes } from './server';
