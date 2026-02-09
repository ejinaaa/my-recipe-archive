'use client';

import { useSuspenseRecipeSection } from '@/entities/recipe/api/hooks';
import { RecipeSection } from '@/widgets/recipe-section';

interface TryMoreSectionProps {
  userId?: string;
  onRecipeClick: (id: string) => void;
}

/**
 * 더 도전해볼 요리 섹션
 * 요리 횟수가 적은 순으로 상위 6개 레시피
 */
export function TryMoreSection({
  userId,
  onRecipeClick,
}: TryMoreSectionProps) {
  const { data: recipes } = useSuspenseRecipeSection('least_cooked');

  if (recipes.length === 0) return null;

  return (
    <RecipeSection
      title='이런 요리도 만들어봐요'
      recipes={recipes}
      moreHref='/search/results?sort=least_cooked'
      userId={userId}
      onRecipeClick={onRecipeClick}
    />
  );
}
