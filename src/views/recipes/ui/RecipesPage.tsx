'use client';

import { Suspense, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageOff, Search, User } from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import { ROUTES } from '@/shared/config';
import { LinkButton } from '@/shared/ui/link-button';
import { PageHeader } from '@/shared/ui/page-header';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeSectionSkeleton } from '@/widgets/recipe-section';
import { CategorySectionSkeleton } from '@/widgets/category-section';
import { SilentErrorBoundary } from './sections/SilentErrorBoundary';
import { MostCookedSection } from './sections/MostCookedSection';
import { TryMoreSection } from './sections/TryMoreSection';
import { RecentRecipesSection } from './sections/RecentRecipesSection';
import { AllRecipesSection } from './sections/AllRecipesSection';
import { TodayPickSection } from './sections/TodayPickSection';
import { CategorySection } from '@/widgets/category-section';
import { Skeleton } from '@/shared/ui/skeleton';

export function RecipesPage() {
  const { data: profile } = useCurrentProfile();
  const router = useRouter();
  const { hasValidImage: hasProfileImage, hasError: profileImageError, handleError: handleProfileImageError } = useImageError(profile?.image_url);

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
          {/* 왼쪽: 프로필 + 인사말 */}
          <div className='flex items-center gap-3'>
            <div className='relative size-10 rounded-full bg-neutral-200 overflow-hidden'>
              {hasProfileImage ? (
                <Image
                  src={profile!.image_url!}
                  alt='프로필'
                  fill
                  className='object-cover'
                  onError={handleProfileImageError}
                />
              ) : profileImageError ? (
                <ImageOff className='size-5 text-text-secondary' />
              ) : (
                <User className='size-full p-2 text-text-secondary' />
              )}
            </div>
            <div>
              <p className='text-heading-2 text-text-primary'>
                안녕, {profile?.nickname || '요리사'}님
              </p>
              <p className='pt-0.5 text-body-2 text-text-secondary'>
                오늘은 뭘 먹을까요?
              </p>
            </div>
          </div>

          {/* 오른쪽: 검색 버튼 */}
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
                <Skeleton className='h-5 w-40 rounded-md mb-3' />
                <Skeleton className='h-[200px] w-full rounded-2xl' />
              </div>
            }
          >
            <TodayPickSection />
          </Suspense>
        </SilentErrorBoundary>

        {/* 많이 해본 요리 */}
        <SilentErrorBoundary>
          <Suspense fallback={<RecipeSectionSkeleton />}>
            <MostCookedSection
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
          <Suspense fallback={<RecipeSectionSkeleton />}>
            <TryMoreSection
              userId={profile?.id}
              onRecipeClick={handleRecipeClick}
            />
          </Suspense>
        </SilentErrorBoundary>

        {/* 최근 추가한 레시피 */}
        <SilentErrorBoundary>
          <Suspense fallback={<RecipeSectionSkeleton />}>
            <RecentRecipesSection
              userId={profile?.id}
              onRecipeClick={handleRecipeClick}
            />
          </Suspense>
        </SilentErrorBoundary>
      </div>

      {/* 전체 레시피 */}
      <AllRecipesSection />

      <BottomNavigation activeTab='home' />
    </div>
  );
}
