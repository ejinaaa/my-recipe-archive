'use client';

import { useCallback } from 'react';
import { RecipeCardCompact } from '@/entities/recipe/ui/RecipeCardCompact';
import { useSuspenseRecipeSection } from '@/entities/recipe/api/hooks';
import {
  useRecipeFavorites,
  useToggleFavorite,
} from '@/entities/favorite/api/hooks';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { Section, SectionHeader } from '@/shared/ui/section';
import { ROUTES } from '@/shared/config';
import type { RecipeSortBy } from '@/entities/recipe/api/server';

const DEFAULT_SECTION_LIMIT = 6;

interface RecipeCarouselProps {
  /** 섹션 제목 */
  title: string;
  /** 정렬 기준 */
  sortBy: RecipeSortBy;
  /** 조회할 레시피 수 */
  limit?: number;
  /** "전체 보기" 링크 경로 */
  moreHref?: string;
  /** 현재 유저 ID (즐겨찾기용) */
  userId?: string;
}

/**
 * 수평 스크롤 레시피 캐러셀 위젯
 * 내부에서 정렬 기준별 레시피를 조회하고 즐겨찾기 상태를 관리
 */
export function RecipeCarousel({
  title,
  sortBy,
  limit = DEFAULT_SECTION_LIMIT,
  moreHref,
  userId,
}: RecipeCarouselProps) {
  const { data: recipes } = useSuspenseRecipeSection(sortBy, limit);

  const { favoriteStatuses } = useRecipeFavorites(userId, recipes);
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = useCallback(
    (recipeId: string) => {
      if (!userId) return;
      toggleFavorite.mutate({ userId, recipeId });
    },
    [userId, toggleFavorite],
  );

  if (recipes.length === 0) return null;

  return (
    <Section>
      <SectionHeader title={title} moreHref={moreHref} />

      <HorizontalScroll className='gap-3 px-4'>
        {recipes.map(recipe => (
          <RecipeCardCompact
            key={recipe.id}
            recipe={recipe}
            isFavorite={favoriteStatuses?.[recipe.id] ?? false}
            onToggleFavorite={() => handleToggleFavorite(recipe.id)}
            href={ROUTES.RECIPES.DETAIL(recipe.id)}
          />
        ))}
      </HorizontalScroll>
    </Section>
  );
}
