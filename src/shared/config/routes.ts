/**
 * 애플리케이션 라우트 경로 상수
 * 모든 URL path는 이 파일에서 관리
 */

export const ROUTES = {
  /** 홈 */
  HOME: '/',

  /** 인증 관련 */
  AUTH: {
    LOGIN: '/login',
    CONFIRM: '/auth/confirm',
  },

  /** 레시피 관련 */
  RECIPES: {
    DETAIL: (id: string) => `/recipes/${id}`,
    NEW: '/recipes/new',
    EDIT: (id: string) => `/recipes/${id}/edit`,
  },

  /** 검색 */
  SEARCH: '/search',
  SEARCH_RESULTS: '/search/results',

  /** 즐겨찾기 */
  FAVORITES: '/favorites',
} as const;
