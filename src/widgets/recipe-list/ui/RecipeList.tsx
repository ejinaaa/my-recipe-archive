'use client';

import { useRouter } from 'next/navigation';
import { RecipeCard } from '@/entities/recipe/ui/RecipeCard';
import { useInfiniteRecipes } from '@/entities/recipe/api/hooks';
import { InfiniteScrollList } from '@/shared/ui/infinite-scroll-list';
import { Loader2 } from 'lucide-react';

interface RecipeListProps {
  searchQuery?: string;
}

export function RecipeList({ searchQuery }: RecipeListProps) {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteRecipes({ searchQuery });

  const recipes = data?.pages.flatMap(page => page.recipes) ?? [];

  const handleRecipeClick = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  return (
    <InfiniteScrollList
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isError={isError}
      isEmpty={recipes.length === 0}
      containerClassName='grid grid-cols-2 gap-2 px-3'
      emptyState={
        <div className='flex flex-col items-center justify-center py-20 px-3'>
          <p className='text-body-1 text-text-secondary text-center'>
            검색 결과를 찾지 못했어요
          </p>
          <p className='text-body-2 text-text-secondary text-center mt-1'>
            다른 키워드로 검색해 보세요
          </p>
        </div>
      }
      loadingComponent={
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='size-6 animate-spin text-text-secondary' />
          <span className='ml-2 text-body-2 text-text-secondary'>
            불러오는 중...
          </span>
        </div>
      }
      endComponent={
        <div className='flex items-center justify-center py-8'>
          <p className='text-body-2 text-text-secondary'>
            모든 레시피를 둘러봤어요
          </p>
        </div>
      }
    >
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => handleRecipeClick(recipe.id)}
          className='w-full max-w-none'
        />
      ))}
    </InfiniteScrollList>
  );
}
