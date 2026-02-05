import { create } from 'zustand';
import type { CategoryType } from '@/entities/category/model/types';

/**
 * 카테고리 필터 타입
 * 각 타입별로 선택된 카테고리 코드 배열
 */
export interface CategoryFilters {
  situation: string[];
  cuisine: string[];
  dishType: string[];
}

const initialFilters: CategoryFilters = {
  situation: [],
  cuisine: [],
  dishType: [],
};

interface SearchState {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 확정된 검색어 */
  searchQuery: string;
  /** 확정된 카테고리 필터 */
  categoryFilters: CategoryFilters;
}

interface SearchActions {
  /** 모달 열기 */
  openModal: () => void;
  /** 모달 닫기 */
  closeModal: () => void;
  /** 검색 조건 적용 (검색 버튼 클릭 시) */
  applySearch: (query: string, filters: CategoryFilters) => void;
  /** 필터 초기화 */
  resetFilters: () => void;
}

type SearchStore = SearchState & SearchActions;

export const useSearchStore = create<SearchStore>(set => ({
  // 초기 상태
  isOpen: false,
  searchQuery: '',
  categoryFilters: initialFilters,

  // 액션
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  applySearch: (query, filters) =>
    set({
      searchQuery: query,
      categoryFilters: filters,
      isOpen: false,
    }),
  resetFilters: () =>
    set({
      searchQuery: '',
      categoryFilters: initialFilters,
    }),
}));

/**
 * 카테고리 필터 토글 유틸리티
 */
export const toggleCategoryFilter = (
  filters: CategoryFilters,
  type: CategoryType,
  code: string
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
