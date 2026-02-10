import { ROUTES } from '@/shared/config';

/**
 * API 에러 클래스 및 응답 핸들링 유틸리티
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * fetch 응답을 공통으로 처리
 * - 401: 로그인 페이지로 리다이렉트
 * - !ok: 서버 에러 메시지 파싱 후 ApiError throw
 * - ok: JSON 파싱 후 반환
 */
export const handleApiResponse = async <T>(
  res: Response,
  fallbackMessage: string,
): Promise<T> => {
  if (res.status === 401) {
    if (typeof window !== 'undefined') window.location.href = ROUTES.AUTH.LOGIN;
    throw new ApiError('로그인 후 다시 시도해주세요', 401);
  }

  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      message = body?.error || fallbackMessage;
    } catch {
      // JSON 파싱 실패 시 fallback 메시지 사용
    }
    throw new ApiError(message, res.status);
  }

  return res.json();
};
