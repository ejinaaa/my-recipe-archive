import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { RECIPE_PAGE_SIZE } from '../model/constants';
import type { Recipe } from '../model/types';
import type { PaginatedRecipes, RecipeSortBy } from './server';
import type { InfiniteRecipesParams } from './keys';

/** InfiniteRecipesParams를 URL 쿼리 스트링으로 변환 */
export const buildRecipesSearchParams = (
  params: InfiniteRecipesParams | undefined,
  offset: number
): URLSearchParams => {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(RECIPE_PAGE_SIZE));
  searchParams.set('offset', String(offset));

  if (params?.searchQuery) {
    searchParams.set('searchQuery', params.searchQuery);
  }
  if (params?.sortBy) {
    searchParams.set('sortBy', params.sortBy);
  }
  if (params?.favoritesByUserId) {
    searchParams.set('favoritesByUserId', params.favoritesByUserId);
  }
  if (params?.categories?.situation?.length) {
    searchParams.set('categories.situation', params.categories.situation.join(','));
  }
  if (params?.categories?.cuisine?.length) {
    searchParams.set('categories.cuisine', params.categories.cuisine.join(','));
  }
  if (params?.categories?.dishType?.length) {
    searchParams.set('categories.dishType', params.categories.dishType.join(','));
  }
  if (params?.cookingTimeRange?.min !== undefined) {
    searchParams.set(
      'cookingTimeRange.min',
      String(params.cookingTimeRange.min)
    );
  }
  if (params?.cookingTimeRange?.max !== undefined) {
    searchParams.set(
      'cookingTimeRange.max',
      String(params.cookingTimeRange.max)
    );
  }

  return searchParams;
};

/** API Route를 통해 전체 레시피 목록 조회 */
export const fetchRecipes = async (
  userId?: string
): Promise<Recipe[]> => {
  const searchParams = new URLSearchParams();
  searchParams.set('limit', '1000');
  searchParams.set('offset', '0');
  if (userId) searchParams.set('favoritesByUserId', userId);

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/recipes?${searchParams}`);

  if (!res.ok) {
    throw new Error('레시피 목록을 불러오는데 실패했습니다.');
  }

  const data: PaginatedRecipes = await res.json();
  return data.recipes;
};

/** API Route를 통해 레시피 목록 조회 (페이지네이션) */
export const fetchRecipesPaginated = async (
  params: InfiniteRecipesParams | undefined,
  offset: number
): Promise<PaginatedRecipes> => {
  const searchParams = buildRecipesSearchParams(params, offset);
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/recipes?${searchParams.toString()}`);

  if (!res.ok) {
    throw new Error('레시피 목록을 불러오는데 실패했습니다.');
  }

  return res.json();
};

/** 홈 섹션용 레시피 조회 (상위 N개) */
export const fetchRecipesSection = async (
  sortBy: RecipeSortBy,
  limit: number = 6
): Promise<Recipe[]> => {
  const searchParams = new URLSearchParams();
  searchParams.set('sortBy', sortBy);
  searchParams.set('limit', String(limit));
  searchParams.set('offset', '0');

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/recipes?${searchParams}`);

  if (!res.ok) {
    throw new Error('레시피를 불러오는데 실패했습니다.');
  }

  const data: PaginatedRecipes = await res.json();
  return data.recipes;
};

/** 오늘의 추천 레시피 조회 */
export const fetchRandomRecipe = async (): Promise<Recipe | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/recipes/random`);

  if (!res.ok) {
    throw new Error('추천 레시피를 불러오는데 실패했습니다.');
  }

  return res.json();
};

/** API Route를 통해 단일 레시피 조회 */
export const fetchRecipe = async (id: string): Promise<Recipe | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/recipes/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('레시피를 불러오는데 실패했습니다.');
  }

  return res.json();
};
