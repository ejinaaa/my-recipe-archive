import type { CategoryType } from './types';

/**
 * 카테고리 타입 순서 (situation → cuisine → dishType)
 */
export const CATEGORY_TYPES: CategoryType[] = [
  'situation',
  'cuisine',
  'dishType',
];

/**
 * 카테고리 타입별 한글 레이블
 */
export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  situation: '먹는 상황',
  cuisine: '요리 장르',
  dishType: '요리 종류',
};
