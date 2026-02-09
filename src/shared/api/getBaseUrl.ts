/** 서버/클라이언트 환경에 따른 Base URL 반환 */
export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // 서버: 절대 URL 필요
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  // 클라이언트: 상대 URL
  return '';
};
