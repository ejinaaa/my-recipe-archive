'use client';

import { useSuspenseRecipeSection } from '@/entities/recipe/api/hooks';
import { RecipeSection } from '@/widgets/recipe-section';

interface MostCookedSectionProps {
  userId?: string;
  onRecipeClick: (id: string) => void;
}

/**
 * 많이 해본 요리 섹션
 * 요리 횟수 기준 상위 6개 레시피
 */
export function MostCookedSection({
  userId,
  onRecipeClick,
}: MostCookedSectionProps) {
  const { data: recipes } = useSuspenseRecipeSection('most_cooked');

  if (recipes.length === 0) return null;

  return (
    <RecipeSection
      title='자주 만드는 요리들이에요'
      recipes={recipes}
      moreHref='/search/results?sort=most_cooked'
      userId={userId}
      onRecipeClick={onRecipeClick}
    />
  );
}
