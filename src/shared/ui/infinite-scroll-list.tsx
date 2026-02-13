'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollListProps {
  /** 다음 페이지를 가져오는 함수 */
  fetchNextPage: () => void;
  /** 다음 페이지가 있는지 여부 */
  hasNextPage: boolean;
  /** 다음 페이지를 로딩 중인지 여부 */
  isFetchingNextPage: boolean;
  /** 에러 발생 여부 */
  isError?: boolean;
  /** 표시할 아이템들 (children으로 전달) */
  children: ReactNode;
  /** 아이템이 비어있는지 여부 */
  isEmpty?: boolean;
  /** 빈 상태일 때 표시할 컴포넌트 */
  emptyComponent?: ReactNode;
  /** 로딩 중일 때 표시할 컴포넌트 */
  loadingComponent?: ReactNode;
  /** 에러 발생 시 표시할 컴포넌트 */
  errorComponent?: ReactNode;
  /** 모든 데이터를 불러왔을 때 표시할 컴포넌트 */
  endComponent?: ReactNode;
  /** 그리드 컨테이너 클래스 (선택) */
  containerClassName?: string;
  /** Intersection Observer threshold (기본값: 0.1) */
  threshold?: number;
}

// 기본 로딩 컴포넌트
function DefaultLoadingComponent() {
  return (
    <div className='flex items-center justify-center py-8'>
      <Loader2 className='size-6 animate-spin text-text-secondary' />
      <span className='ml-2 text-body-2 text-text-secondary'>불러오는 중...</span>
    </div>
  );
}

// 기본 종료 컴포넌트
function DefaultEndComponent() {
  return (
    <div className='flex items-center justify-center py-8'>
      <p className='text-body-2 text-text-secondary'>더 이상 항목이 없어요</p>
    </div>
  );
}

// 기본 빈 상태 컴포넌트
function DefaultEmptyComponent() {
  return (
    <div className='flex flex-col items-center justify-center py-20 px-3'>
      <p className='text-body-1 text-text-secondary text-center'>
        아직 항목이 없어요
      </p>
    </div>
  );
}

export function InfiniteScrollList({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isError = false,
  children,
  isEmpty = false,
  emptyComponent,
  loadingComponent,
  errorComponent,
  endComponent,
  containerClassName,
  threshold = 0.1,
}: InfiniteScrollListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  return (
    <div className='pb-4'>
      {/* Error State */}
      {isError && errorComponent && <>{errorComponent}</>}

      {/* Empty State */}
      {!isError && isEmpty && (
        <>{emptyComponent || <DefaultEmptyComponent />}</>
      )}

      {/* Items Container */}
      {!isError && !isEmpty && (
        <div className={containerClassName}>{children}</div>
      )}

      {/* Loading Indicator */}
      {isFetchingNextPage && (
        <>{loadingComponent || <DefaultLoadingComponent />}</>
      )}

      {/* Intersection Observer Target */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={observerTarget} className='h-4' />
      )}

      {/* End Component */}
      {!hasNextPage && !isEmpty && !isError && (
        <>{endComponent || <DefaultEndComponent />}</>
      )}
    </div>
  );
}
