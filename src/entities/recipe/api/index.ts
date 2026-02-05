// Server-side API
export {
  getRecipes,
  getRecipe,
  getRecipesPaginated,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  incrementViewCount,
} from './server';

// Server Actions
export {
  getRecipesAction,
  getRecipeAction,
  getRecipesPaginatedAction,
  createRecipeAction,
  updateRecipeAction,
  deleteRecipeAction,
  incrementViewCountAction,
} from './actions';

// Client-side React Query hooks
export {
  useRecipes,
  useRecipe,
  useSuspenseRecipe,
  useInfiniteRecipes,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
  useIncrementViewCount,
  recipeKeys,
} from './hooks';

// Re-export types for convenience
export type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
export type {
  GetRecipesParams,
  PaginatedRecipes,
  RecipeSortBy,
  CategoryFilter,
  CookingTimeRange,
} from './server';
export type { UseInfiniteRecipesParams } from './hooks';
