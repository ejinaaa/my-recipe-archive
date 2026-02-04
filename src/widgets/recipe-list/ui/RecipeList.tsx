'use client';

import { useEffect, useRef } from 'react';
import { RecipeCard } from '@/entities/recipe/ui/RecipeCard';
import { useInfiniteRecipes } from '@/entities/recipe/api/hooks';
import { Loader2 } from 'lucide-react';

interface RecipeListProps {
  searchQuery?: string;
}

export function RecipeList({ searchQuery }: RecipeListProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRecipes({ searchQuery });

  const recipes = data?.pages.flatMap(page => page.recipes) ?? [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className='pb-4'>
      {/* Empty State */}
      {recipes.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 px-3'>
          <p className='text-body-1 text-text-secondary text-center'>
            검색 결과가 없습니다
          </p>
        </div>
      )}

      {/* Recipe Grid */}
      {recipes.length > 0 && (
        <div className='grid grid-cols-2 gap-2 px-3'>
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className='w-full max-w-none'
            />
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {isFetchingNextPage && (
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='size-6 animate-spin text-text-secondary' />
          <span className='ml-2 text-body-2 text-text-secondary'>
            로딩 중...
          </span>
        </div>
      )}

      {/* Intersection Observer Target */}
      {hasNextPage && !isFetchingNextPage && (
        <div ref={observerTarget} className='h-4' />
      )}

      {/* End Message */}
      {!hasNextPage && recipes.length > 0 && (
        <div className='flex items-center justify-center py-8'>
          <p className='text-body-2 text-text-secondary'>
            모든 레시피를 불러왔습니다
          </p>
        </div>
      )}
    </div>
  );
}
