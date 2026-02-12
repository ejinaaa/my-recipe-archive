// Client-side React Query hooks
export {
  useSuspenseRecipe,
  useSuspenseInfiniteRecipes,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
  useIncrementViewCount,
} from './hooks';

// Query keys
export { recipeKeys } from './keys';

// Re-export types for convenience
export type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
export type {
  GetRecipesParams,
  PaginatedRecipes,
  RecipeSortBy,
  CategoryFilter,
  CookingTimeRange,
} from './server';
export type { InfiniteRecipesParams } from './keys';
