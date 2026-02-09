import { getBaseUrl } from '@/shared/api/getBaseUrl';

/** API Route를 통해 즐겨찾기 상태 조회 */
export const fetchIsFavorited = async (
  userId: string,
  recipeId: string
): Promise<boolean> => {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({ userId, recipeId });
  const res = await fetch(`${baseUrl}/api/favorites/status?${searchParams}`);

  if (!res.ok) {
    throw new Error('즐겨찾기 상태를 불러오는데 실패했습니다.');
  }

  return res.json();
};

/** API Route를 통해 다건 즐겨찾기 상태 조회 */
export const fetchFavoriteStatuses = async (
  userId: string,
  recipeIds: string[]
): Promise<Record<string, boolean>> => {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({
    userId,
    recipeIds: recipeIds.join(','),
  });
  const res = await fetch(`${baseUrl}/api/favorites/statuses?${searchParams}`);

  if (!res.ok) {
    throw new Error('즐겨찾기 상태를 불러오는데 실패했습니다.');
  }

  return res.json();
};
