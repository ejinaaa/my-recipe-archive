'use client';

import { useSuspenseRecipeSection } from '@/entities/recipe/api/hooks';
import { RecipeSection } from '@/widgets/recipe-section';

interface RecentRecipesSectionProps {
  userId?: string;
  onRecipeClick: (id: string) => void;
}

/**
 * 최근 추가한 레시피 섹션
 * 최신 등록순 상위 6개 레시피
 */
export function RecentRecipesSection({
  userId,
  onRecipeClick,
}: RecentRecipesSectionProps) {
  const { data: recipes } = useSuspenseRecipeSection('latest');

  if (recipes.length === 0) return null;

  return (
    <RecipeSection
      title='새로 추가한 요리에요'
      recipes={recipes}
      moreHref='/search/results?sort=latest'
      userId={userId}
      onRecipeClick={onRecipeClick}
    />
  );
}
