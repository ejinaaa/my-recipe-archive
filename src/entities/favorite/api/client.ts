import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { handleApiResponse } from '@/shared/api/fetchWithError';

/** API Route를 통해 즐겨찾기 상태 조회 */
export const fetchIsFavorited = async (
  userId: string,
  recipeId: string
): Promise<boolean> => {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams({ userId, recipeId });
  const res = await fetch(`${baseUrl}/api/favorites/status?${searchParams}`);

  return handleApiResponse<boolean>(res, '즐겨찾기 정보를 가져오지 못했어요');
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

  return handleApiResponse<Record<string, boolean>>(res, '즐겨찾기 정보를 가져오지 못했어요');
};
