import { create } from 'zustand';
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

interface SortState {
  /** 바텀시트 열림 상태 */
  isOpen: boolean;
  /** 현재 선택된 정렬 옵션 */
  sortBy: RecipeSortBy;
}

interface SortActions {
  /** 바텀시트 열기 */
  openBottomSheet: () => void;
  /** 바텀시트 닫기 */
  closeBottomSheet: () => void;
  /** 정렬 옵션 적용 */
  applySortBy: (sortBy: RecipeSortBy) => void;
  /** 정렬 초기화 */
  resetSort: () => void;
}

type SortStore = SortState & SortActions;

export const useSortStore = create<SortStore>(set => ({
  // 초기 상태
  isOpen: false,
  sortBy: 'latest',

  // 액션
  openBottomSheet: () => set({ isOpen: true }),
  closeBottomSheet: () => set({ isOpen: false }),
  applySortBy: sortBy =>
    set({
      sortBy,
      isOpen: false,
    }),
  resetSort: () => set({ sortBy: 'latest' }),
}));
