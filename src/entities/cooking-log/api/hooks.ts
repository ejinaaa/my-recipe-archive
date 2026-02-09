'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Recipe } from '@/entities/recipe/model/types';
import { recipeKeys } from '@/entities/recipe/api/keys';
import type { CookingLog, RecipeCookCount } from '../model/types';
import { addCookingLogAction, deleteCookingLogAction } from './actions';
import { fetchCookCount, fetchUserCookCounts } from './client';
import { cookingLogKeys } from './keys';

/**
 * 특정 레시피의 유저 요리 횟수 조회 hook
 */
export function useCookCount(
  userId: string | undefined,
  recipeId: string
): UseQueryResult<number, Error> {
  return useQuery({
    queryKey: cookingLogKeys.count(userId || '', recipeId),
    queryFn: () => fetchCookCount(userId!, recipeId),
    enabled: !!userId && !!recipeId,
  });
}

/**
 * 유저의 모든 레시피별 요리 횟수 조회 hook
 */
export function useUserCookCounts(
  userId: string | undefined
): UseQueryResult<RecipeCookCount[], Error> {
  return useQuery({
    queryKey: cookingLogKeys.userCounts(userId || ''),
    queryFn: () => fetchUserCookCounts(userId!),
    enabled: !!userId,
  });
}

/**
 * 요리 완료 기록 추가 hook
 * cook_count는 DB 트리거로 자동 증가
 */
export function useAddCookingLog(): UseMutationResult<
  CookingLog,
  Error,
  { userId: string; recipeId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, recipeId }) =>
      addCookingLogAction(userId, recipeId),
    meta: { suppressErrorToast: true },
    onMutate: async ({ userId, recipeId }) => {
      // 관련 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: cookingLogKeys.count(userId, recipeId),
      });

      // 요리 횟수 optimistic update (+1)
      const previousCount = queryClient.getQueryData<number>(
        cookingLogKeys.count(userId, recipeId)
      );

      queryClient.setQueryData<number>(
        cookingLogKeys.count(userId, recipeId),
        old => (old ?? 0) + 1
      );

      // 레시피의 cook_count도 optimistic update
      queryClient.setQueryData<Recipe>(recipeKeys.detail(recipeId), old => {
        if (!old) return old;
        return { ...old, cook_count: old.cook_count + 1 };
      });

      return { previousCount };
    },
    onError: (err, { userId, recipeId }, context) => {
      // 롤백
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          cookingLogKeys.count(userId, recipeId),
          context.previousCount
        );
      }
    },
    onSettled: (_, __, { userId, recipeId }) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: cookingLogKeys.count(userId, recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: cookingLogKeys.userCounts(userId),
      });
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: recipeKeys.lists(),
      });
    },
  });
}

/**
 * 요리 기록 삭제 hook
 */
export function useDeleteCookingLog(): UseMutationResult<
  void,
  Error,
  { logId: string; recipeId: string; userId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ logId, recipeId }) =>
      deleteCookingLogAction(logId, recipeId),
    onSettled: (_, __, { userId, recipeId }) => {
      queryClient.invalidateQueries({
        queryKey: cookingLogKeys.count(userId, recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: cookingLogKeys.userCounts(userId),
      });
      queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(recipeId),
      });
      queryClient.invalidateQueries({
        queryKey: recipeKeys.lists(),
      });
    },
  });
}
