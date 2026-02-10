'use client';

import { useMemo, useCallback } from 'react';
import { RecipeCardCompact } from '@/entities/recipe/ui/RecipeCardCompact';
import {
  useFavoriteStatuses,
  useToggleFavorite,
} from '@/entities/favorite/api/hooks';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { Section, SectionHeader } from '@/shared/ui/section';
import type { Recipe } from '@/entities/recipe/model/types';

interface RecipeSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 표시할 레시피 목록 */
  recipes: Recipe[];
  /** "전체 보기" 링크 경로 */
  moreHref?: string;
  /** 현재 유저 ID (즐겨찾기용) */
  userId?: string;
  /** 레시피 카드 클릭 핸들러 */
  onRecipeClick: (id: string) => void;
}

/**
 * 수평 스크롤 레시피 섹션 위젯
 * 즐겨찾기 상태 관리를 내부에서 처리
 */
export function RecipeSection({
  title,
  recipes,
  moreHref,
  userId,
  onRecipeClick,
}: RecipeSectionProps) {
  const recipeIds = useMemo(() => recipes.map(r => r.id), [recipes]);
  const { data: favoriteStatuses } = useFavoriteStatuses(userId, recipeIds);
  const toggleFavorite = useToggleFavorite();

  const handleToggleFavorite = useCallback(
    (recipeId: string) => {
      if (!userId) return;
      toggleFavorite.mutate({ userId, recipeId });
    },
    [userId, toggleFavorite],
  );

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
            onClick={() => onRecipeClick(recipe.id)}
          />
        ))}
      </HorizontalScroll>
    </Section>
  );
}
