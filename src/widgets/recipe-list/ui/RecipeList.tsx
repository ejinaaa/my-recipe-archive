'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { RecipeCard } from '@/entities/recipe/ui/RecipeCard';
import { useInfiniteRecipes } from '@/entities/recipe/api/hooks';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import {
  useFavoriteStatuses,
  useToggleFavorite,
} from '@/entities/favorite/api/hooks';
import type {
  CategoryFilter,
  CookingTimeRange,
  RecipeSortBy,
} from '@/entities/recipe/api/server';
import { ROUTES } from '@/shared/config';
import { InfiniteScrollList } from '@/shared/ui/infinite-scroll-list';

interface RecipeListProps {
  searchQuery?: string;
  categories?: CategoryFilter;
  cookingTimeRange?: CookingTimeRange;
  sortBy?: RecipeSortBy;
}

export function RecipeList({
  searchQuery,
  categories,
  cookingTimeRange,
  sortBy,
}: RecipeListProps) {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteRecipes({ searchQuery, categories, cookingTimeRange, sortBy });

  const recipes = useMemo(
    () => data?.pages.flatMap(page => page.recipes) ?? [],
    [data?.pages],
  );

  // 현재 사용자 프로필 조회
  const { data: currentProfile } = useCurrentProfile();
  const userId = currentProfile?.id;

  // 레시피 ID 목록 추출
  const recipeIds = useMemo(() => recipes.map(recipe => recipe.id), [recipes]);

  // 즐겨찾기 상태 조회
  const { data: favoriteStatuses } = useFavoriteStatuses(userId, recipeIds);

  useEffect(() => {
    console.log('즐겨찾기: ', favoriteStatuses);
  }, [favoriteStatuses]);

  // 즐겨찾기 토글 mutation
  const toggleFavorite = useToggleFavorite();

  const handleRecipeClick = (recipeId: string) => {
    router.push(ROUTES.RECIPES.DETAIL(recipeId));
  };

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = useCallback(
    (recipeId: string) => {
      if (!userId) return;
      console.log('레시피 id: ', recipeId);
      toggleFavorite.mutate({ userId, recipeId });
    },
    [userId, toggleFavorite],
  );

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
          isFavorite={favoriteStatuses?.[recipe.id] ?? false}
          onToggleFavorite={() => handleToggleFavorite(recipe.id)}
          onClick={() => handleRecipeClick(recipe.id)}
          className='w-full max-w-none'
        />
      ))}
    </InfiniteScrollList>
  );
}
