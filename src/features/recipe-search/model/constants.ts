import type { RecipeSortBy } from '@/entities/recipe/model/types';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import type { CategoryFilters, CookingTimeRange } from './types';

/**
 * 초기 필터 값
 */
export const initialFilters: CategoryFilters = {
  situation: [],
  cuisine: [],
  dishType: [],
};

/**
 * 초기 조리시간 범위 값
 */
export const initialCookingTimeRange: CookingTimeRange = {
  min: COOKING_TIME_MIN,
  max: COOKING_TIME_MAX,
};

/**
 * 정렬 옵션 정의
 */
export const SORT_OPTIONS: { value: RecipeSortBy; icon: string; label: string }[] = [
  { value: 'latest', icon: '✨', label: '최근 등록한 요리' },
  { value: 'oldest', icon: '📜', label: '오래전에 등록한 요리' },
  { value: 'most_cooked', icon: '🔥', label: '많이 해본 요리' },
  { value: 'least_cooked', icon: '🌟', label: '더 도전해볼 요리' },
  { value: 'most_viewed', icon: '👀', label: '많이 찾아본 요리' },
  { value: 'least_viewed', icon: '🔍', label: '적게 찾아본 요리' },
  { value: 'favorites', icon: '❤️', label: '많이 좋아하는 요리' },
];
