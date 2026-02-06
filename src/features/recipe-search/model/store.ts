import type { CategoryType } from '@/entities/category/model/types';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';

/**
 * 카테고리 필터 타입
 * 각 타입별로 선택된 카테고리 코드 배열
 */
export interface CategoryFilters {
  situation: string[];
  cuisine: string[];
  dishType: string[];
}

/**
 * 조리시간 범위 타입 (분 단위)
 */
export interface CookingTimeRange {
  min: number;
  max: number;
}

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
 * 카테고리 필터 토글 유틸리티
 */
export const toggleCategoryFilter = (
  filters: CategoryFilters,
  type: CategoryType,
  code: string,
): CategoryFilters => {
  const currentCodes = filters[type];
  const isSelected = currentCodes.includes(code);

  return {
    ...filters,
    [type]: isSelected
      ? currentCodes.filter(c => c !== code)
      : [...currentCodes, code],
  };
};
