// Client-side React Query hooks
export {
  useSuspenseRecipeQuery,
  useSuspenseInfiniteRecipesQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useIncrementViewCountMutation,
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
} from '../model/types';
export type { InfiniteRecipesParams } from './keys';
