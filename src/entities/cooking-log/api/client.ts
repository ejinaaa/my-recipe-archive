import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { handleApiResponse } from '@/shared/api/fetchWithError';
import type { RecipeCookCount } from '../model/types';

/**
 * Route API를 통해 특정 레시피의 유저 요리 횟수 조회
 */
export const fetchCookCount = async (
  userId: string,
  recipeId: string
): Promise<number> => {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({ userId, recipeId });
  const res = await fetch(`${baseUrl}/api/cooking-logs/count?${searchParams}`);

  return handleApiResponse<number>(res, '요리 횟수를 가져오지 못했어요');
};

/**
 * Route API를 통해 유저의 모든 레시피별 요리 횟수 조회
 */
export const fetchUserCookCounts = async (
  userId: string
): Promise<RecipeCookCount[]> => {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({ userId });
  const res = await fetch(
    `${baseUrl}/api/cooking-logs/user-counts?${searchParams}`
  );

  return handleApiResponse<RecipeCookCount[]>(res, '요리 횟수를 가져오지 못했어요');
};
