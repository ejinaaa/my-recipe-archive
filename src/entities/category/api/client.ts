import { getBaseUrl } from '@/shared/api/getBaseUrl';
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

  if (!res.ok) {
    throw new Error('카테고리 목록을 불러오는데 실패했습니다.');
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error('카테고리를 불러오는데 실패했습니다.');
  }

  return res.json();
};

/** API Route를 통해 카테고리 그룹 조회 */
export const fetchCategoryGroups = async (): Promise<CategoryGroup[]> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/categories/groups`);

  if (!res.ok) {
    throw new Error('카테고리 그룹을 불러오는데 실패했습니다.');
  }

  return res.json();
};
