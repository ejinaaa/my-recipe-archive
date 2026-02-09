'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ChevronRight } from 'lucide-react';
import { RecipeList, RecipeListSkeleton } from '@/widgets/recipe-list';
import { RecipeListError } from '@/widgets/recipe-list/ui/RecipeListError';
import { LinkButton } from '@/shared/ui/link-button';

/**
 * 전체 레시피 섹션
 * 기존 RecipeList 위젯 (무한 스크롤)을 래핑
 */
export function AllRecipesSection() {
  return (
    <section className='mt-8'>
      <div className='flex items-center justify-between px-4 mb-3'>
        <h2 className='text-heading-3 text-text-primary'>나의 모든 레시피</h2>
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

      <ErrorBoundary FallbackComponent={RecipeListError}>
        <Suspense fallback={<RecipeListSkeleton />}>
          <RecipeList />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
