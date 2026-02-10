'use client';

import { useState, type ReactNode } from 'react';
import { ErrorBottomSheet } from '@/shared/ui/error-bottom-sheet';

interface QueryErrorFallbackProps {
  /** 에러 발생 시 배경으로 표시할 스켈레톤 */
  skeleton: ReactNode;
  /** 다시 시도 콜백 (ErrorBoundary resetErrorBoundary) */
  onRetry?: () => void;
  /** 닫기 콜백 */
  onCancel?: () => void;
  /** 홈으로 콜백 */
  onHome?: () => void;
  /** Bottom Sheet 제목 */
  title?: string;
  /** Bottom Sheet 설명 */
  description?: string;
}

/**
 * 쿼리 에러 발생 시 Skeleton + ErrorBottomSheet를 동시에 표시하는 fallback
 *
 * - 다시 시도: ErrorBoundary 리셋 → children 재렌더 → Suspense가 skeleton 표시
 * - 닫기: skeleton + bottom sheet 모두 제거 (빈 영역)
 */
export function QueryErrorFallback({
  skeleton,
  onRetry,
  onCancel,
  onHome,
  title,
  description,
}: QueryErrorFallbackProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      {skeleton}
      <ErrorBottomSheet
        open
        onOpenChange={open => {
          if (!open) {
            setDismissed(true);
            onCancel?.();
          }
        }}
        onRetry={onRetry}
        onCancel={() => {
          setDismissed(true);
          onCancel?.();
        }}
        onHome={onHome}
        title={title}
        description={description}
      />
    </>
  );
}
