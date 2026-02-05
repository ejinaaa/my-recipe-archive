import { Badge } from '@/shared/ui/badge';
import type { Ingredient } from '@/entities/recipe/model/types';

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
}

/**
 * 레시피 재료 섹션 컴포넌트
 */
export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  if (ingredients.length === 0) {
    return null;
  }

  return (
    <section className='mb-14'>
      <h2 className='text-heading-3 font-semibold mb-4 text-text-primary'>
        재료
      </h2>
      <ul className='space-y-3'>
        {ingredients.map((ingredient, index) => (
          <li key={index} className='flex items-start gap-2 text-body-2'>
            <Badge
              variant='outline'
              colorScheme='neutral'
              size='md'
              transparent={true}
            >
              {ingredient.name} {ingredient.amount} {ingredient.unit}
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
