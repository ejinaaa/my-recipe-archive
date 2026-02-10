'use client';

import { Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { Search } from 'lucide-react';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import { ROUTES } from '@/shared/config';
import { LinkButton } from '@/shared/ui/link-button';
import { PageHeader } from '@/shared/ui/page-header';
import { QueryErrorFallback } from '@/shared/ui/query-error-fallback';
import { Section, SectionHeader } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { CategorySection, CategorySectionSkeleton } from '@/widgets/category-section';
import { RecipeList, RecipeListSkeleton } from '@/widgets/recipe-list';
import { RecipeCarousel, RecipeCarouselSkeleton } from '@/widgets/recipe-section';
import { ProfileGreeting } from './ProfileGreeting';
import { SilentErrorBoundary } from './sections/SilentErrorBoundary';
import { TodayPickSection } from './sections/TodayPickSection';

export function RecipesPage() {
  const { data: profile } = useCurrentProfile();
  const router = useRouter();

  const handleRecipeClick = useCallback(
    (recipeId: string) => {
      router.push(ROUTES.RECIPES.DETAIL(recipeId));
    },
    [router],
  );

  return (
    <div className='min-h-screen pb-20 bg-background'>
      <PageHeader>
        <div className='flex items-center justify-between'>
          <ProfileGreeting profile={profile} />

          <LinkButton
            href={ROUTES.SEARCH}
            variant='solid'
            colorScheme='primary'
            size='sm'
            transparent
            className='size-10 p-0'
            aria-label='검색'
          >
            <Search />
          </LinkButton>
        </div>
      </PageHeader>

      <div className='flex flex-col gap-6 mt-2'>
        {/* 오늘의 추천 요리 */}
        <SilentErrorBoundary>
          <Suspense
            fallback={
              <div className='px-4'>
                <div className='relative w-full h-[200px] overflow-hidden rounded-3xl bg-neutral-base/30'>
                  {/* 그라데이션 오버레이 */}
                  <div className='absolute inset-0 bg-gradient-to-br from-surface from-30% via-surface/60 via-60% to-transparent' />

                  {/* 콘텐츠 스켈레톤 */}
                  <div className='relative flex h-full w-[65%] flex-col justify-between p-4'>
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-5 w-40 rounded-md' />
                      <Skeleton className='h-4 w-32 rounded-md' />
                    </div>
                    <Skeleton className='h-11 w-[150px] rounded-full' />
                  </div>
                </div>
              </div>
            }
          >
            <TodayPickSection />
          </Suspense>
        </SilentErrorBoundary>

        {/* 많이 해본 요리 */}
        <SilentErrorBoundary>
          <Suspense fallback={<RecipeCarouselSkeleton title='자주 만드는 요리들이에요' />}>
            <RecipeCarousel
              title='자주 만드는 요리들이에요'
              sortBy='most_cooked'
              moreHref={`${ROUTES.SEARCH_RESULTS}?sort=most_cooked`}
              userId={profile?.id}
              onRecipeClick={handleRecipeClick}
            />
          </Suspense>
        </SilentErrorBoundary>

        {/* 카테고리로 찾기 */}
        <SilentErrorBoundary>
          <Suspense fallback={<CategorySectionSkeleton />}>
            <CategorySection />
          </Suspense>
        </SilentErrorBoundary>

        {/* 더 도전해볼 요리 */}
        <SilentErrorBoundary>
          <Suspense fallback={<RecipeCarouselSkeleton title='이런 요리도 만들어봐요' />}>
            <RecipeCarousel
              title='이런 요리도 만들어봐요'
              sortBy='least_cooked'
              moreHref={`${ROUTES.SEARCH_RESULTS}?sort=least_cooked`}
              userId={profile?.id}
              onRecipeClick={handleRecipeClick}
            />
          </Suspense>
        </SilentErrorBoundary>

        {/* 최근 추가한 레시피 */}
        <SilentErrorBoundary>
          <Suspense fallback={<RecipeCarouselSkeleton title='새로 추가한 요리에요' />}>
            <RecipeCarousel
              title='새로 추가한 요리에요'
              sortBy='latest'
              moreHref={`${ROUTES.SEARCH_RESULTS}?sort=latest`}
              userId={profile?.id}
              onRecipeClick={handleRecipeClick}
            />
          </Suspense>
        </SilentErrorBoundary>
      </div>

      {/* 전체 레시피 */}
      <Section className='mt-8'>
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => (
            <>
              <SectionHeader title='나의 모든 레시피' size='lg' moreHref={ROUTES.SEARCH_RESULTS} disabled />
              <QueryErrorFallback
                skeleton={<RecipeListSkeleton />}
                onRetry={resetErrorBoundary}
                title='레시피 목록을 가져오지 못했어요'
                description='네트워크 상태를 확인하고 다시 시도해주세요'
              />
            </>
          )}
        >
          <Suspense
            fallback={
              <>
                <SectionHeader title='나의 모든 레시피' size='lg' moreHref={ROUTES.SEARCH_RESULTS} disabled />
                <RecipeListSkeleton />
              </>
            }
          >
            <SectionHeader title='나의 모든 레시피' size='lg' moreHref={ROUTES.SEARCH_RESULTS} />
            <RecipeList />
          </Suspense>
        </ErrorBoundary>
      </Section>

      <BottomNavigation activeTab='home' />
    </div>
  );
}
