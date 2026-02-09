import { getBaseUrl } from '@/shared/api/getBaseUrl';
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

  if (!res.ok) {
    throw new Error('요리 횟수를 불러오는데 실패했습니다.');
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error('요리 횟수를 불러오는데 실패했습니다.');
  }

  return res.json();
};
