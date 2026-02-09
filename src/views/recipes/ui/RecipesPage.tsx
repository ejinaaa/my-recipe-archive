'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { ErrorBoundary } from 'react-error-boundary';
import { Search, User } from 'lucide-react';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import { ROUTES } from '@/shared/config';
import { LinkButton } from '@/shared/ui/link-button';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList, RecipeListSkeleton } from '@/widgets/recipe-list';
import { RecipeListError } from '@/widgets/recipe-list/ui/RecipeListError';

export function RecipesPage() {
  const { data: profile } = useCurrentProfile();

  return (
    <div className='min-h-screen pb-20 bg-background'>
      <header className='sticky top-0 z-10 bg-background px-4 pt-4 pb-3'>
        <div className='flex items-center justify-between'>
          {/* 왼쪽: 프로필 + 인사말 */}
          <div className='flex items-center gap-3'>
            <div className='relative size-10 rounded-full bg-neutral-200 overflow-hidden'>
              {profile?.image_url ? (
                <Image
                  src={profile.image_url}
                  alt='프로필'
                  fill
                  className='object-cover'
                />
              ) : (
                <User className='size-full p-2 text-text-secondary' />
              )}
            </div>
            <div>
              <p className='text-heading-3 text-text-primary'>
                안녕, {profile?.nickname || '요리사'}님
              </p>
              <p className='text-body-2 text-text-secondary'>
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
      </header>

      <ErrorBoundary FallbackComponent={RecipeListError}>
        <Suspense fallback={<RecipeListSkeleton />}>
          <RecipeList />
        </Suspense>
      </ErrorBoundary>

      <BottomNavigation activeTab='home' />
    </div>
  );
}
