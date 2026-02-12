'use client';

import {
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
import {
  createRecipeAction,
  updateRecipeAction,
  deleteRecipeAction,
  incrementViewCountAction,
} from './actions';
import {
  fetchRecipe,
  fetchRecipesPaginated,
  fetchRecipesSection,
  fetchRandomRecipe,
} from './client';
import { recipeKeys, type InfiniteRecipesParams } from './keys';
import type { RecipeSortBy } from '../model/types';

/**
 * Suspense를 지원하는 단일 레시피 조회 hook
 * Route API를 통해 데이터 조회
 */
export function useSuspenseRecipeQuery(id: string) {
  return useSuspenseQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => fetchRecipe(id),
  });
}

/**
 * Suspense를 지원하는 무한 스크롤 레시피 목록 조회 hook
 * 초기 로딩 시 Suspense boundary로 throw됨
 */
export function useSuspenseInfiniteRecipesQuery(params?: InfiniteRecipesParams) {
  return useSuspenseInfiniteQuery({
    queryKey: recipeKeys.infinite(params),
    queryFn: ({ pageParam = 0 }) => fetchRecipesPaginated(params, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      const loadedCount = allPages.reduce(
        (sum, page) => sum + page.recipes.length,
        0
      );
      return loadedCount;
    },
    initialPageParam: 0,
  });
}

/**
 * 홈 섹션용 레시피 조회 hook (Suspense)
 * 정렬 기준별 상위 N개 레시피를 조회
 */
export function useSuspenseRecipeSectionQuery(
  sortBy: RecipeSortBy,
  limit: number = 6
) {
  return useSuspenseQuery({
    queryKey: recipeKeys.section(sortBy),
    queryFn: () => fetchRecipesSection(sortBy, limit),
  });
}

/**
 * 오늘의 추천 레시피 조회 hook (Suspense)
 */
export function useSuspenseRandomRecipeQuery() {
  return useSuspenseQuery({
    queryKey: recipeKeys.random(),
    queryFn: fetchRandomRecipe,
  });
}

/**
 * Hook to create a new recipe
 * Includes optimistic updates for immediate UI feedback
 */
export function useCreateRecipeMutation(): UseMutationResult<
  Recipe,
  Error,
  RecipeInsert
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipeAction,
    meta: { handleErrorManually: true },
    onMutate: async newRecipe => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: recipeKeys.lists() });

      // Snapshot the previous value
      const previousRecipes = queryClient.getQueryData(recipeKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData<Recipe[]>(recipeKeys.lists(), old => {
        if (!old) return old;

        const optimisticRecipe: Recipe = {
          id: 'temp-' + Date.now(),
          ...newRecipe,
          categories: newRecipe.categories || [],
          ingredients: newRecipe.ingredients || [],
          steps: newRecipe.steps || [],
          is_public: newRecipe.is_public ?? false,
          view_count: 0,
          favorite_count: 0,
          cook_count: 0,
          tags: newRecipe.tags || [],
          created_at: new Date(),
          updated_at: new Date(),
        };

        return [optimisticRecipe, ...old];
      });

      return { previousRecipes };
    },
    onError: (err, newRecipe, context) => {
      // Rollback on error
      if (context?.previousRecipes) {
        queryClient.setQueryData(recipeKeys.lists(), context.previousRecipes);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing recipe
 * Includes optimistic updates for immediate UI feedback
 */
export function useUpdateRecipeMutation(): UseMutationResult<
  Recipe,
  Error,
  { id: string; data: RecipeUpdate }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateRecipeAction(id, data),
    meta: { handleErrorManually: true },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: recipeKeys.detail(id) });

      // Snapshot the previous value
      const previousRecipe = queryClient.getQueryData(recipeKeys.detail(id));

      // Optimistically update to the new value
      queryClient.setQueryData<Recipe>(recipeKeys.detail(id), old => {
        if (!old) return old;
        return { ...old, ...data, updated_at: new Date() };
      });

      return { previousRecipe };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousRecipe) {
        queryClient.setQueryData(recipeKeys.detail(id), context.previousRecipe);
      }
    },
    onSettled: (data, error, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

/**
 * Hook to delete a recipe
 * Includes optimistic updates for immediate UI feedback
 */
export function useDeleteRecipeMutation(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipeAction,
    meta: { handleErrorManually: true },
    onMutate: async id => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: recipeKeys.lists() });

      // Snapshot the previous value
      const previousRecipes = queryClient.getQueryData(recipeKeys.lists());

      // Optimistically remove from the list
      queryClient.setQueryData<Recipe[]>(recipeKeys.lists(), old => {
        if (!old) return old;
        return old.filter(recipe => recipe.id !== id);
      });

      return { previousRecipes };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousRecipes) {
        queryClient.setQueryData(recipeKeys.lists(), context.previousRecipes);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

/**
 * Hook to increment view count
 * 하루에 유저당 1회만 카운트됨
 */
export function useIncrementViewCountMutation(): UseMutationResult<
  void,
  Error,
  { recipeId: string; userId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, userId }) =>
      incrementViewCountAction(recipeId, userId),
    meta: { suppressErrorToast: true },
    onSuccess: (_, { recipeId }) => {
      // Optimistically update view count
      queryClient.setQueryData<Recipe>(recipeKeys.detail(recipeId), old => {
        if (!old) return old;
        return { ...old, view_count: old.view_count + 1 };
      });
    },
  });
}
