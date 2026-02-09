import { create } from 'zustand';

interface NavigationState {
  // 마지막 방문 URL (쿼리 파라미터 포함)
  lastSearchUrl: string | null;
  lastFavoritesUrl: string | null;

  // 액션
  setLastSearchUrl: (url: string | null) => void;
  setLastFavoritesUrl: (url: string | null) => void;
}

/**
 * 네비게이션 상태 store
 * BottomNavigation에서 이전 방문 페이지로 돌아갈 때 사용
 */
export const useNavigationStore = create<NavigationState>(set => ({
  lastSearchUrl: null,
  lastFavoritesUrl: null,
  setLastSearchUrl: url => set({ lastSearchUrl: url }),
  setLastFavoritesUrl: url => set({ lastFavoritesUrl: url }),
}));
