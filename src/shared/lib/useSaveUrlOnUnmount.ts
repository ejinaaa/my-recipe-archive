'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * 페이지 컴포넌트 언마운트 시 현재 URL을 저장하는 범용 훅
 * 도메인 종속성(어디에 저장할지)은 사용처에서 주입
 *
 * @param saveUrl - URL을 저장하는 콜백 함수
 */
export function useSaveUrlOnUnmount(saveUrl: (url: string) => void) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ref로 최신 URL 유지 (클로저 문제 방지)
  const urlRef = useRef('');

  useEffect(() => {
    urlRef.current = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
  }, [pathname, searchParams]);

  // 언마운트 시에만 저장
  useEffect(() => {
    return () => {
      saveUrl(urlRef.current);
    };
  }, [saveUrl]);
}
