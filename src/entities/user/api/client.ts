import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { handleApiResponse } from '@/shared/api/fetchWithError';
import type { Profile } from '../model/types';

/** API Route를 통해 현재 프로필 조회 */
export const fetchCurrentProfile = async (): Promise<Profile | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/users/me`);

  if (res.status === 404) {
    return null;
  }

  return handleApiResponse<Profile>(res, '프로필 정보를 가져오지 못했어요');
};

/** API Route를 통해 프로필 조회 */
export const fetchProfile = async (id: string): Promise<Profile | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/users/${id}`);

  if (res.status === 404) {
    return null;
  }

  return handleApiResponse<Profile>(res, '프로필 정보를 가져오지 못했어요');
};
