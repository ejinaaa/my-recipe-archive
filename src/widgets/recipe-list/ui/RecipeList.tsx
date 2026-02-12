'use client';

import { useMemo, useCallback, useDeferredValue, type ReactNode } from 'react';
import { RecipeListEndMessage } from './RecipeListEndMessage';
import { RecipeListLoadingIndicator } from './RecipeListLoadingIndicator';
import { RecipeCard } from '@/entities/recipe/ui/RecipeCard';
import { useSuspenseInfiniteRecipesQuery } from '@/entities/recipe/api/hooks';
import { useCurrentProfileQuery } from '@/entities/user/api/hooks';
import {
  useRecipeFavoritesQuery,
  useToggleFavoriteMutation,
} from '@/entities/favorite/api/hooks';
import type {
  CategoryFilter,
  CookingTimeRange,
  RecipeSortBy,
} from '@/entities/recipe/model/types';
import { ROUTES } from '@/shared/config';
import { InfiniteScrollList } from '@/shared/ui/infinite-scroll-list';

interface RecipeListProps {
  searchQuery?: string;
  categories?: CategoryFilter;
  cookingTimeRange?: CookingTimeRange;
  sortBy?: RecipeSortBy;
  /** 해당 유저가 즐겨찾기한 레시피만 조회 */
  favoritesByUserId?: string;
  /** 빈 상태 UI */
  emptyFallback?: ReactNode;
}

const defaultEmptyFallback = (
  <div className='flex flex-col items-center justify-center py-20 px-4'>
    <p className='text-body-1 text-text-secondary text-center'>
      검색 결과를 찾지 못했어요
    </p>
    <p className='text-body-2 text-text-secondary text-center mt-1'>
      다른 키워드로 검색해 보세요
    </p>
  </div>
);

export function RecipeList({
  searchQuery,
  categories,
  cookingTimeRange,
  sortBy,
  favoritesByUserId,
  emptyFallback = defaultEmptyFallback,
}: RecipeListProps) {
  // 쿼리 파라미터 객체 안정화 (참조 동일성 보장)
  const categoriesKey = JSON.stringify(categories);
  const cookingTimeKey = JSON.stringify(cookingTimeRange);
  const params = useMemo(
    () => ({ searchQuery, categories, cookingTimeRange, sortBy, favoritesByUserId }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, categoriesKey, cookingTimeKey, sortBy, favoritesByUserId]
  );

  // params 변경 시 이전 데이터를 유지하며 새 데이터를 transition으로 로딩
  const deferredParams = useDeferredValue(params);
  const isPending = params !== deferredParams;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteRecipesQuery(deferredParams);

  const recipes = useMemo(
    () => data.pages.flatMap(page => page.recipes),
    [data.pages],
  );

  // 현재 사용자 프로필 조회
  const { data: currentProfile } = useCurrentProfileQuery();
  const userId = currentProfile?.id;

  // 즐겨찾기 상태 조회
  const { favoriteStatuses } = useRecipeFavoritesQuery(userId, recipes);

  // 즐겨찾기 토글 mutation
  const toggleFavorite = useToggleFavoriteMutation();

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = useCallback(
    (recipeId: string) => {
      if (!userId) return;
      toggleFavorite.mutate({ userId, recipeId });
    },
    [userId, toggleFavorite],
  );

  return (
    <div className={`transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      <InfiniteScrollList
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isEmpty={recipes.length === 0}
        containerClassName='grid grid-cols-2 gap-2 px-4'
        emptyComponent={emptyFallback}
        loadingComponent={<RecipeListLoadingIndicator />}
        endComponent={<RecipeListEndMessage />}
      >
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favoriteStatuses?.[recipe.id] ?? false}
            onToggleFavorite={() => handleToggleFavorite(recipe.id)}
            href={ROUTES.RECIPES.DETAIL(recipe.id)}
            className='w-full max-w-none'
          />
        ))}
      </InfiniteScrollList>
    </div>
  );
}
