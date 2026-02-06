'use client';

import { useState, useEffect } from 'react';
import { useCategoryGroups } from '@/entities/category/api/hooks';
import type { CategoryType } from '@/entities/category/model/types';
import type { CategoryFilter } from '@/entities/recipe/api/server';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import {
  useFilterStore,
  toggleCategoryFilter,
  initialFilters,
  initialCookingTimeRange,
  type CategoryFilters,
  type CookingTimeRange,
} from './store';

/**
 * 카테고리 타입 정렬 순서
 */
const CATEGORY_TYPE_ORDER: CategoryType[] = [
  'situation',
  'cuisine',
  'dishType',
];

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

/**
 * FilterBottomSheet 공통 로직 훅
 * SearchFilterBottomSheet, FavoriteFilterBottomSheet에서 재사용
 */
export function useFilterBottomSheet() {
  const {
    isOpen,
    categoryFilters,
    cookingTimeRange,
    closeBottomSheet,
    applyFilters,
  } = useFilterStore();

  // 카테고리 데이터 조회
  const {
    data: categoryGroups,
    isLoading,
    isError,
    refetch,
  } = useCategoryGroups();

  // 로컬 상태 (바텀시트 내 편집용)
  const [tempFilters, setTempFilters] =
    useState<CategoryFilters>(categoryFilters);
  const [tempCookingTime, setTempCookingTime] = useState<[number, number]>([
    cookingTimeRange.min,
    cookingTimeRange.max,
  ]);

  // 바텀시트 열릴 때 전역 상태를 로컬로 복사
  useEffect(() => {
    if (isOpen) {
      setTempFilters(categoryFilters);
      setTempCookingTime([cookingTimeRange.min, cookingTimeRange.max]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 카테고리 그룹을 정렬된 순서로 변환
  const sortedGroups = CATEGORY_TYPE_ORDER.map(type => {
    const group = categoryGroups?.find(g => g.type === type);
    return {
      type,
      options: group?.options ?? [],
    };
  });

  const handleToggleCategory = (type: CategoryType, code: string) => {
    setTempFilters(prev => toggleCategoryFilter(prev, type, code));
  };

  const handleClearAll = () => {
    setTempFilters(initialFilters);
    setTempCookingTime([COOKING_TIME_MIN, COOKING_TIME_MAX]);
  };

  // 필터가 하나라도 변경되었는지 확인
  const hasAnyFilter =
    tempFilters.situation.length > 0 ||
    tempFilters.cuisine.length > 0 ||
    tempFilters.dishType.length > 0 ||
    tempCookingTime[0] !== initialCookingTimeRange.min ||
    tempCookingTime[1] !== initialCookingTimeRange.max;

  // 현재 필터 적용
  const handleApply = () => {
    const newCookingTimeRange: CookingTimeRange = {
      min: tempCookingTime[0],
      max: tempCookingTime[1],
    };
    applyFilters(tempFilters, newCookingTimeRange);
  };

  // 필터 초기화 후 적용 (전체 보기)
  const handleApplyEmpty = () => {
    applyFilters(initialFilters, initialCookingTimeRange);
  };

  return {
    isOpen,
    closeBottomSheet,
    sortedGroups,
    isLoading,
    isError,
    refetch,
    tempFilters,
    tempCookingTime,
    setTempCookingTime,
    handleToggleCategory,
    handleClearAll,
    hasAnyFilter,
    handleApply,
    handleApplyEmpty,
  };
}
