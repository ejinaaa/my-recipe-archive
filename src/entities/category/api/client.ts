import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { handleApiResponse } from '@/shared/api/fetchWithError';
import type {
  CategoryOption,
  CategoryGroup,
  CategoryType,
} from '../model/types';

/** API Route를 통해 카테고리 옵션 목록 조회 */
export const fetchCategoryOptions = async (
  type?: CategoryType
): Promise<CategoryOption[]> => {
  const baseUrl = getBaseUrl();
  const searchParams = new URLSearchParams();
  if (type) searchParams.set('type', type);

  const url = searchParams.toString()
    ? `${baseUrl}/api/categories/options?${searchParams}`
    : `${baseUrl}/api/categories/options`;
  const res = await fetch(url);

  return handleApiResponse<CategoryOption[]>(res, '카테고리 정보를 가져오지 못했어요');
};

/** API Route를 통해 단일 카테고리 옵션 조회 */
export const fetchCategoryOption = async (
  id: number
): Promise<CategoryOption | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/categories/options/${id}`);

  if (res.status === 404) {
    return null;
  }

  return handleApiResponse<CategoryOption>(res, '카테고리 정보를 가져오지 못했어요');
};

/** API Route를 통해 카테고리 그룹 조회 */
export const fetchCategoryGroups = async (): Promise<CategoryGroup[]> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/categories/groups`);

  return handleApiResponse<CategoryGroup[]>(res, '카테고리 그룹을 가져오지 못했어요');
};
