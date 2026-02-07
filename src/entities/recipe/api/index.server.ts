// Server-side API (서버 컴포넌트, API Route에서만 사용)
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

// Re-export types
export type {
  GetRecipesParams,
  PaginatedRecipes,
  RecipeSortBy,
  CategoryFilter,
  CookingTimeRange,
} from './server';
