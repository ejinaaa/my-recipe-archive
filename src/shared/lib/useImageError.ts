'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * 이미지 로드 에러 상태를 관리하는 훅
 * URL이 변경되면 에러 상태가 자동으로 리셋된다
 */
export function useImageError(imageUrl?: string | null) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return {
    hasError,
    handleError,
    hasValidImage: !!imageUrl && !hasError,
  } as const;
}
