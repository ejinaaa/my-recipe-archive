import { create } from 'zustand';
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

const initialFilters: CategoryFilters = {
  situation: [],
  cuisine: [],
  dishType: [],
};

const initialCookingTimeRange: CookingTimeRange = {
  min: COOKING_TIME_MIN,
  max: COOKING_TIME_MAX,
};

interface FilterState {
  /** 바텀시트 열림 상태 */
  isOpen: boolean;
  /** 확정된 카테고리 필터 */
  categoryFilters: CategoryFilters;
  /** 확정된 조리시간 범위 */
  cookingTimeRange: CookingTimeRange;
}

interface FilterActions {
  /** 바텀시트 열기 */
  openBottomSheet: () => void;
  /** 바텀시트 닫기 */
  closeBottomSheet: () => void;
  /** 필터 조건 적용 (검색 버튼 클릭 시) */
  applyFilters: (
    filters: CategoryFilters,
    cookingTimeRange: CookingTimeRange,
  ) => void;
  /** 필터 초기화 */
  resetFilters: () => void;
  /** URL 파라미터로 필터 초기화 */
  initializeFromUrl: (
    categoryType: 'situation' | 'cuisine' | 'dishType' | null,
    categoryCode: string,
  ) => void;
}

type FilterStore = FilterState & FilterActions;

export const useFilterStore = create<FilterStore>(set => ({
  // 초기 상태
  isOpen: false,
  categoryFilters: initialFilters,
  cookingTimeRange: initialCookingTimeRange,

  // 액션
  openBottomSheet: () => set({ isOpen: true }),
  closeBottomSheet: () => set({ isOpen: false }),
  applyFilters: (filters, cookingTimeRange) =>
    set({
      categoryFilters: filters,
      cookingTimeRange,
      isOpen: false,
    }),
  resetFilters: () =>
    set({
      categoryFilters: initialFilters,
      cookingTimeRange: initialCookingTimeRange,
    }),
  initializeFromUrl: (categoryType, categoryCode) => {
    if (categoryType && categoryCode) {
      set({
        categoryFilters: {
          ...initialFilters,
          [categoryType]: [categoryCode],
        },
      });
    } else {
      set({ categoryFilters: initialFilters });
    }
  },
}));

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

/**
 * 초기 필터 값
 */
export { initialFilters, initialCookingTimeRange };
