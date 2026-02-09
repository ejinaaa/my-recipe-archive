'use client';

import { useSuspenseRandomRecipe } from '@/entities/recipe/api/hooks';
import { RecipeCardHero } from '@/entities/recipe/ui/RecipeCardHero';

/**
 * 오늘의 추천 요리 섹션
 * 날짜 기반 랜덤 레시피 1개를 Hero 카드로 표시
 */
export function TodayPickSection() {
  const { data: recipe } = useSuspenseRandomRecipe();

  if (!recipe) return null;

  return (
    <section className='px-4'>
      <RecipeCardHero recipe={recipe} />
    </section>
  );
}
