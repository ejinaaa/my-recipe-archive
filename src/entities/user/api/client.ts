import { getBaseUrl } from '@/shared/api/getBaseUrl';
import type { Profile } from '../model/types';

/** API Route를 통해 현재 프로필 조회 */
export const fetchCurrentProfile = async (): Promise<Profile | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/users/me`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('프로필을 불러오는데 실패했습니다.');
  }

  return res.json();
};

/** API Route를 통해 프로필 조회 */
export const fetchProfile = async (id: string): Promise<Profile | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/users/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('프로필을 불러오는데 실패했습니다.');
  }

  return res.json();
};
