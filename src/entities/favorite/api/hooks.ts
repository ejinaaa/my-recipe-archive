'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Recipe } from '@/entities/recipe/model/types';
import { recipeKeys } from '@/entities/recipe/api/hooks';
import {
  toggleFavoriteAction,
  isFavoritedAction,
  getFavoriteStatusesAction,
  getFavoriteRecipesAction,
} from './actions';

/**
 * Query keys factory for favorites
 */
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (userId: string) => [...favoriteKeys.lists(), userId] as const,
  statuses: () => [...favoriteKeys.all, 'status'] as const,
  status: (userId: string, recipeId: string) =>
    [...favoriteKeys.statuses(), userId, recipeId] as const,
  batchStatuses: (userId: string, recipeIds: string[]) =>
    [...favoriteKeys.statuses(), userId, 'batch', recipeIds.sort().join(',')] as const,
};

/**
 * Hook to check if a recipe is favorited
 */
export function useIsFavorited(
  userId: string | undefined,
  recipeId: string
): UseQueryResult<boolean, Error> {
  return useQuery({
    queryKey: favoriteKeys.status(userId || '', recipeId),
    queryFn: () => isFavoritedAction(userId!, recipeId),
    enabled: !!userId && !!recipeId,
  });
}

/**
 * Hook to get favorite statuses for multiple recipes
 */
export function useFavoriteStatuses(
  userId: string | undefined,
  recipeIds: string[]
): UseQueryResult<Record<string, boolean>, Error> {
  return useQuery({
    queryKey: favoriteKeys.batchStatuses(userId || '', recipeIds),
    queryFn: () => getFavoriteStatusesAction(userId!, recipeIds),
    enabled: !!userId && recipeIds.length > 0,
  });
}

/**
 * Hook to get user's favorite recipes
 */
export function useFavoriteRecipes(
  userId: string | undefined
): UseQueryResult<Recipe[], Error> {
  return useQuery({
    queryKey: favoriteKeys.list(userId || ''),
    queryFn: () => getFavoriteRecipesAction(userId!),
    enabled: !!userId,
  });
}

/**
 * Hook to toggle favorite status
 */
export function useToggleFavorite(): UseMutationResult<
  boolean,
  Error,
  { userId: string; recipeId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, recipeId }) =>
      toggleFavoriteAction(userId, recipeId),
    onMutate: async ({ userId, recipeId }) => {
      // 이전 상태 취소
      await queryClient.cancelQueries({
        queryKey: favoriteKeys.status(userId, recipeId),
      });

      // 이전 값 스냅샷
      const previousStatus = queryClient.getQueryData<boolean>(
        favoriteKeys.status(userId, recipeId)
      );

      // Optimistic update
      queryClient.setQueryData<boolean>(
        favoriteKeys.status(userId, recipeId),
        old => !old
      );

      // 레시피의 favorite_count도 optimistic update
      queryClient.setQueryData<Recipe>(recipeKeys.detail(recipeId), old => {
        if (!old) return old;
        return {
          ...old,
          favorite_count: old.favorite_count + (previousStatus ? -1 : 1),
        };
      });

      return { previousStatus };
    },
    onError: (err, { userId, recipeId }, context) => {
      // 롤백
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          favoriteKeys.status(userId, recipeId),
          context.previousStatus
        );
      }
    },
    onSettled: (_, __, { userId, recipeId }) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.status(userId, recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(recipeId),
      });
    },
  });
}
