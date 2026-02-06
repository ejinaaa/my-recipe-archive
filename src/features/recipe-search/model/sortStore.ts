import type { RecipeSortBy } from '@/entities/recipe/api/server';

/**
 * 정렬 옵션 정의
 */
export const SORT_OPTIONS: { value: RecipeSortBy; label: string }[] = [
  { value: 'latest', label: '✨ 최근 등록한 요리' },
  { value: 'oldest', label: '📜 오래전에 등록한 요리' },
  { value: 'popular', label: '🔥 많이 해본 요리' },
  { value: 'unpopular', label: '🌟 더 도전해볼 요리' },
  { value: 'favorites', label: '❤️ 많이 좋아하는 요리' },
];
