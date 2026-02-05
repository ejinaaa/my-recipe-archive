/**
 * 애플리케이션 라우트 경로 상수
 * 모든 URL path는 이 파일에서 관리
 */

export const ROUTES = {
  /** 홈 (레시피 목록으로 리다이렉트) */
  HOME: '/',

  /** 인증 관련 */
  AUTH: {
    LOGIN: '/login',
    CONFIRM: '/auth/confirm',
  },

  /** 레시피 관련 */
  RECIPES: {
    LIST: '/recipes',
    DETAIL: (id: string) => `/recipes/${id}`,
    NEW: '/recipes/new',
  },

  /** 검색 */
  SEARCH: '/search',

  /** 즐겨찾기 */
  FAVORITES: '/favorites',
} as const;
