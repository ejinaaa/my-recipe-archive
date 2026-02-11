'use client';

import { useMemo } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Recipe } from '@/entities/recipe/model/types';
import { recipeKeys } from '@/entities/recipe/api';
import { toggleFavoriteAction } from './actions';
import { fetchIsFavorited, fetchFavoriteStatuses } from './client';
import { favoriteKeys } from './keys';

/**
 * Hook to check if a recipe is favorited
 */
export function useIsFavorited(
  userId: string | undefined,
  recipeId: string,
): UseQueryResult<boolean, Error> {
  return useQuery({
    queryKey: favoriteKeys.status(userId || '', recipeId),
    queryFn: () => fetchIsFavorited(userId!, recipeId),
    enabled: !!userId && !!recipeId,
  });
}

/**
 * Hook to get favorite statuses for multiple recipes
 */
export function useFavoriteStatuses(
  userId: string | undefined,
  recipeIds: string[],
): UseQueryResult<Record<string, boolean>, Error> {
  return useQuery({
    queryKey: favoriteKeys.batchStatuses(userId || '', recipeIds),
    queryFn: () => fetchFavoriteStatuses(userId!, recipeIds),
    enabled: !!userId && recipeIds.length > 0,
  });
}

/**
 * 레시피 목록의 즐겨찾기 상태를 일괄 조회하는 훅
 * recipeIds 메모이제이션 + useFavoriteStatuses를 묶어 제공
 */
export function useRecipeFavorites(
  userId: string | undefined,
  recipes: { id: string }[],
) {
  const recipeIds = useMemo(() => recipes.map(r => r.id), [recipes]);
  const { data: favoriteStatuses } = useFavoriteStatuses(userId, recipeIds);
  return { favoriteStatuses };
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
      // 관련 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: favoriteKeys.status(userId, recipeId),
      });
      await queryClient.cancelQueries({
        queryKey: favoriteKeys.statuses(),
        exact: false,
      });

      // 개별 상태 스냅샷
      const previousStatus = queryClient.getQueryData<boolean>(
        favoriteKeys.status(userId, recipeId),
      );

      // batchStatuses 쿼리들 스냅샷
      const previousBatchStatuses = queryClient.getQueriesData<
        Record<string, boolean>
      >({
        queryKey: [...favoriteKeys.statuses(), userId, 'batch'],
        exact: false,
      });

      // 개별 상태 optimistic update
      queryClient.setQueryData<boolean>(
        favoriteKeys.status(userId, recipeId),
        old => !old,
      );

      // batchStatuses 쿼리들도 optimistic update
      queryClient.setQueriesData<Record<string, boolean>>(
        {
          queryKey: [...favoriteKeys.statuses(), userId, 'batch'],
          exact: false,
        },
        old => {
          if (!old || !(recipeId in old)) return old;
          return {
            ...old,
            [recipeId]: !old[recipeId],
          };
        },
      );

      // 레시피의 favorite_count도 optimistic update
      queryClient.setQueryData<Recipe>(recipeKeys.detail(recipeId), old => {
        if (!old) return old;
        return {
          ...old,
          favorite_count: old.favorite_count + (previousStatus ? -1 : 1),
        };
      });

      return { previousStatus, previousBatchStatuses };
    },
    onError: (err, { userId, recipeId }, context) => {
      // 개별 상태 롤백
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(
          favoriteKeys.status(userId, recipeId),
          context.previousStatus,
        );
      }

      // batchStatuses 롤백
      if (context?.previousBatchStatuses) {
        context.previousBatchStatuses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_, __, { userId, recipeId }) => {
      // 개별 상태 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.status(userId, recipeId),
      });
      // batchStatuses는 stale만 마킹 (즉시 refetch 방지 → 깜빡임 방지)
      queryClient.invalidateQueries({
        queryKey: [...favoriteKeys.statuses(), userId, 'batch'],
        exact: false,
        refetchType: 'none',
      });
      // 즐겨찾기 목록 무효화
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.list(userId),
      });
      // 레시피 상세 무효화
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(recipeId),
      });
    },
  });
}
