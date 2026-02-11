'use client';

import { useSuspenseRandomRecipe } from '@/entities/recipe/api/hooks';
import { RecipeCardHero } from '@/entities/recipe/ui/RecipeCardHero';
import { Section } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';

/**
 * 오늘의 추천 요리 섹션
 * 날짜 기반 랜덤 레시피 1개를 Hero 카드로 표시
 */
export function TodayPickSection() {
  const { data: recipe } = useSuspenseRandomRecipe();

  if (!recipe) return null;

  return (
    <Section className='px-4'>
      <RecipeCardHero recipe={recipe} />
    </Section>
  );
}

export function TodayPickSectionSkeleton() {
  return (
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
  );
}
