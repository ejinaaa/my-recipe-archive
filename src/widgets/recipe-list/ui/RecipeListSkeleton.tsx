import { RecipeCardSkeleton } from '@/entities/recipe/ui/RecipeCardSkeleton';

export function RecipeListSkeleton() {
  return (
    <div className='pb-4'>
      <div className='grid grid-cols-2 gap-2 px-5'>
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
