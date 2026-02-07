import { RECIPE_PAGE_SIZE } from '../model/constants';
import type { PaginatedRecipes } from './server';
import type { InfiniteRecipesParams } from './keys';

/** 서버/클라이언트 환경에 따른 Base URL 반환 */
const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // 서버: 절대 URL 필요
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  // 클라이언트: 상대 URL
  return '';
};

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
  if (params?.categories?.situation) {
    searchParams.set('categories.situation', params.categories.situation);
  }
  if (params?.categories?.cuisine) {
    searchParams.set('categories.cuisine', params.categories.cuisine);
  }
  if (params?.categories?.dishType) {
    searchParams.set('categories.dishType', params.categories.dishType);
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

/** API Route를 통해 레시피 목록 조회 */
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
