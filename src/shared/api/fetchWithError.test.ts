import { describe, it, expect, vi } from 'vitest';
import { ApiError, handleApiResponse } from './fetchWithError';

/**
 * Response mock helper
 */
const createMockResponse = (
  status: number,
  body?: unknown,
  ok?: boolean,
): Response => {
  return {
    status,
    ok: ok ?? (status >= 200 && status < 300),
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
};

describe('ApiError', () => {
  it('status와 name 속성을 가진다', () => {
    const error = new ApiError('테스트 에러', 404);

    expect(error.message).toBe('테스트 에러');
    expect(error.status).toBe(404);
    expect(error.name).toBe('ApiError');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('handleApiResponse', () => {
  it('401 응답이면 ApiError(401)를 throw한다', async () => {
    const res = createMockResponse(401);

    await expect(
      handleApiResponse(res, 'fallback'),
    ).rejects.toThrow(new ApiError('로그인 후 다시 시도해주세요', 401));
  });

  it('에러 응답 + JSON body가 있으면 서버 메시지를 사용한다', async () => {
    const res = createMockResponse(500, { error: '서버 에러 발생' });

    await expect(
      handleApiResponse(res, 'fallback'),
    ).rejects.toThrow('서버 에러 발생');
  });

  it('에러 응답 + JSON body에 error 필드가 없으면 fallback 메시지를 사용한다', async () => {
    const res = createMockResponse(500, { message: '다른 형식' });

    await expect(
      handleApiResponse(res, '데이터를 가져오지 못했어요'),
    ).rejects.toThrow('데이터를 가져오지 못했어요');
  });

  it('에러 응답 + JSON 파싱 실패 시 fallback 메시지를 사용한다', async () => {
    const res = {
      status: 500,
      ok: false,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as unknown as Response;

    await expect(
      handleApiResponse(res, '요청을 처리하지 못했어요'),
    ).rejects.toThrow('요청을 처리하지 못했어요');
  });

  it('에러의 status 코드가 정확하다', async () => {
    const res = createMockResponse(403, { error: '권한 없음' });

    try {
      await handleApiResponse(res, 'fallback');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(403);
    }
  });

  it('성공 응답이면 JSON을 파싱하여 반환한다', async () => {
    const data = { id: '1', title: '레시피' };
    const res = createMockResponse(200, data);

    const result = await handleApiResponse<{ id: string; title: string }>(
      res,
      'fallback',
    );

    expect(result).toEqual(data);
  });
});
