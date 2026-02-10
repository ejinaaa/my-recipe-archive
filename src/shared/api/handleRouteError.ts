import { NextResponse } from 'next/server';

/**
 * Route API 공통 에러 핸들링 유틸리티
 *
 * Supabase 에러 코드에 따라 적절한 HTTP 상태 코드 + 메시지를 반환한다.
 */
export function handleRouteError(error: unknown, context: string) {
  console.error(`[API] ${context} error:`, error);

  if (error instanceof Error) {
    const supabaseError = error as { code?: string };

    // 권한 없음 (RLS 위반 등)
    if (supabaseError.code === '42501') {
      return NextResponse.json(
        { error: '권한이 없어 처리하지 못했어요' },
        { status: 403 },
      );
    }

    // FK 참조 무결성 위반 (관련 데이터 삭제됨)
    if (supabaseError.code === '23503') {
      return NextResponse.json(
        { error: '관련 데이터가 삭제되어 처리하지 못했어요' },
        { status: 400 },
      );
    }

    // 유니크 제약 위반 (중복)
    if (supabaseError.code === '23505') {
      return NextResponse.json(
        { error: '이미 추가된 항목이에요' },
        { status: 409 },
      );
    }
  }

  // 범용 500 에러
  const message =
    error instanceof Error ? error.message : '요청을 처리하지 못했어요';
  return NextResponse.json({ error: message }, { status: 500 });
}
