import type { Profile } from './types';

/**
 * 기본 mock 프로필 (Storybook/테스트용)
 */
export const mockProfile: Profile = {
  id: 'user-1',
  nickname: '요리사',
  image_url:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  updated_at: new Date('2024-01-01'),
};

/**
 * 다수 프로필 mock 데이터
 */
export const mockProfiles: Profile[] = [
  mockProfile,
  { id: 'user-2', nickname: '셰프', updated_at: new Date('2024-01-10') },
  { id: 'user-3', nickname: '집밥러' },
];
