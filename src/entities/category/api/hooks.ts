'use client';

import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type {
  CategoryOption,
  CategoryOptionInsert,
  CategoryOptionUpdate,
  CategoryType,
  CategoryGroup,
} from '../model/types';
import {
  createCategoryOptionAction,
  updateCategoryOptionAction,
  deleteCategoryOptionAction,
} from './actions';
import {
  fetchCategoryGroups,
  fetchCategoryOptions,
  fetchCategoryOption,
} from './client';
import { categoryKeys } from './keys';

/**
 * Hook to fetch all category options, optionally filtered by type
 */
export function useCategoryOptions(
  type?: CategoryType
): UseQueryResult<CategoryOption[], Error> {
  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: () => fetchCategoryOptions(type),
  });
}

/**
 * Hook to fetch a single category option by ID
 */
export function useCategoryOption(
  id: number
): UseQueryResult<CategoryOption | null, Error> {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategoryOption(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch category options grouped by type
 */
export function useCategoryGroups(): UseQueryResult<CategoryGroup[], Error> {
  return useQuery({
    queryKey: categoryKeys.groups(),
    queryFn: fetchCategoryGroups,
  });
}

/**
 * Suspense를 지원하는 카테고리 그룹 조회 hook
 * prefetch + HydrationBoundary와 함께 사용
 */
export function useSuspenseCategoryGroups() {
  return useSuspenseQuery({
    queryKey: categoryKeys.groups(),
    queryFn: fetchCategoryGroups,
  });
}

/**
 * Hook to create a new category option
 * Includes optimistic updates for immediate UI feedback
 */
export function useCreateCategoryOption(): UseMutationResult<
  CategoryOption,
  Error,
  CategoryOptionInsert
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryOptionAction,
    onMutate: async newOption => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

      // Snapshot the previous value
      const previousOptions = queryClient.getQueryData(categoryKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData<CategoryOption[]>(categoryKeys.lists(), old => {
        if (!old) return old;

        const optimisticOption: CategoryOption = {
          id: -Date.now(), // Temporary negative ID
          ...newOption,
        };

        return [...old, optimisticOption];
      });

      return { previousOptions };
    },
    onError: (err, newOption, context) => {
      // Rollback on error
      if (context?.previousOptions) {
        queryClient.setQueryData(categoryKeys.lists(), context.previousOptions);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.groups() });
    },
  });
}

/**
 * Hook to update an existing category option
 * Includes optimistic updates for immediate UI feedback
 */
export function useUpdateCategoryOption(): UseMutationResult<
  CategoryOption,
  Error,
  { id: number; data: CategoryOptionUpdate }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCategoryOptionAction(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: categoryKeys.detail(id) });

      // Snapshot the previous value
      const previousOption = queryClient.getQueryData(categoryKeys.detail(id));

      // Optimistically update to the new value
      queryClient.setQueryData<CategoryOption>(categoryKeys.detail(id), old => {
        if (!old) return old;
        return { ...old, ...data } as CategoryOption;
      });

      return { previousOption };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousOption) {
        queryClient.setQueryData(
          categoryKeys.detail(id),
          context.previousOption
        );
      }
    },
    onSettled: (data, error, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.groups() });
    },
  });
}

/**
 * Hook to delete a category option
 * Includes optimistic updates for immediate UI feedback
 */
export function useDeleteCategoryOption(): UseMutationResult<
  void,
  Error,
  number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryOptionAction,
    onMutate: async id => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: categoryKeys.lists() });

      // Snapshot the previous value
      const previousOptions = queryClient.getQueryData(categoryKeys.lists());

      // Optimistically remove from the list
      queryClient.setQueryData<CategoryOption[]>(categoryKeys.lists(), old => {
        if (!old) return old;
        return old.filter(option => option.id !== id);
      });

      return { previousOptions };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousOptions) {
        queryClient.setQueryData(categoryKeys.lists(), context.previousOptions);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.groups() });
    },
  });
}
