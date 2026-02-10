import type { RecipeCookCount } from './types';

/**
 * 레시피별 요리 횟수 mock 데이터
 */
export const mockRecipeCookCounts: RecipeCookCount[] = [
  { recipe_id: '1', count: 5 },
  { recipe_id: '2', count: 3 },
  { recipe_id: '3', count: 1 },
];

/**
 * 단일 요리 횟수 mock 값
 */
export const MOCK_COOK_COUNT = 3;
