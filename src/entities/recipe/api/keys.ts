import type {
  RecipeSortBy,
  CategoryFilter,
  CookingTimeRange,
} from './server';

/** 레시피 목록 조회 파라미터 */
export interface InfiniteRecipesParams {
  userId?: string;
  searchQuery?: string;
  isPublic?: boolean;
  categories?: CategoryFilter;
  cookingTimeRange?: CookingTimeRange;
  tags?: string[];
  sortBy?: RecipeSortBy;
  /** 해당 유저가 즐겨찾기한 레시피만 조회 */
  favoritesByUserId?: string;
}

/**
 * Query keys factory for recipes
 */
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (userId?: string) => [...recipeKeys.lists(), { userId }] as const,
  infinite: (params?: InfiniteRecipesParams) =>
    [...recipeKeys.lists(), 'infinite', params] as const,
  sections: () => [...recipeKeys.all, 'sections'] as const,
  section: (sortBy: RecipeSortBy) =>
    [...recipeKeys.sections(), sortBy] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};
