'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ChevronRight } from 'lucide-react';
import { RecipeList, RecipeListSkeleton } from '@/widgets/recipe-list';
import { QueryErrorFallback } from '@/shared/ui/query-error-fallback';
import { LinkButton } from '@/shared/ui/link-button';

/**
 * 전체 레시피 섹션
 * 기존 RecipeList 위젯 (무한 스크롤)을 래핑
 */
export function AllRecipesSection() {
  return (
    <section className='mt-8'>
      <div className='flex items-center justify-between px-4 mb-3'>
        <h2 className='text-heading-2 text-text-primary'>나의 모든 레시피</h2>
        <LinkButton
          href='/search/results'
          variant='ghost'
          colorScheme='primary'
          size='sm'
          className='text-primary gap-0.5 px-1'
        >
          <ChevronRight className='size-4' />
        </LinkButton>
      </div>

      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <QueryErrorFallback
            skeleton={<RecipeListSkeleton />}
            onRetry={resetErrorBoundary}
            title='레시피 목록을 가져오지 못했어요'
            description='네트워크 상태를 확인하고 다시 시도해주세요'
          />
        )}
      >
        <Suspense fallback={<RecipeListSkeleton />}>
          <RecipeList />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
