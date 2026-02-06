import type { CategoryFilter } from '@/entities/recipe/api/server';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import {
  useFilterStore,
  type CategoryFilters,
  type CookingTimeRange,
} from './store';

/**
 * store의 CategoryFilters를 API의 CategoryFilter로 변환
 * 배열의 첫 번째 값만 사용 (단일 선택)
 */
export const toCategoryFilter = (
  filters: CategoryFilters,
): CategoryFilter | undefined => {
  const result: CategoryFilter = {};

  if (filters.situation.length > 0) {
    result.situation = filters.situation[0];
  }
  if (filters.cuisine.length > 0) {
    result.cuisine = filters.cuisine[0];
  }
  if (filters.dishType.length > 0) {
    result.dishType = filters.dishType[0];
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

/**
 * 조리시간 범위가 기본값인지 확인
 */
export const isDefaultCookingTimeRange = (range: CookingTimeRange): boolean => {
  return range.min === COOKING_TIME_MIN && range.max === COOKING_TIME_MAX;
};

/**
 * 조리시간 범위를 API 형식으로 변환
 * 기본값인 경우 undefined 반환
 */
export const toCookingTimeRange = (
  range: CookingTimeRange,
): { min: number; max: number } | undefined => {
  if (isDefaultCookingTimeRange(range)) {
    return undefined;
  }
  return { min: range.min, max: range.max };
};

/**
 * RecipeList에서 사용할 필터 값을 반환하는 훅
 * store의 필터 상태를 API 호환 형식으로 변환
 */
export function useRecipeFilters() {
  const { categoryFilters, cookingTimeRange, openBottomSheet } =
    useFilterStore();

  const categoryFilter = toCategoryFilter(categoryFilters);
  const cookingTimeFilter = toCookingTimeRange(cookingTimeRange);

  return {
    /** API 호출에 사용할 카테고리 필터 */
    categoryFilter,
    /** API 호출에 사용할 조리시간 범위 */
    cookingTimeFilter,
    /** 필터 바텀시트 열기 */
    openBottomSheet,
  };
}
