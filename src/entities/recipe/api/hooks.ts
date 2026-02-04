'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
import {
  createRecipeAction,
  updateRecipeAction,
  deleteRecipeAction,
} from './actions';

/**
 * Query keys factory for recipes
 */
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (userId?: string) => [...recipeKeys.lists(), { userId }] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

/**
 * Hook to fetch all recipes, optionally filtered by user ID
 */
export function useRecipes(userId?: string): UseQueryResult<Recipe[], Error> {
  return useQuery({
    queryKey: recipeKeys.list(userId),
    queryFn: async () => {
      const { getRecipes } = await import('./server');
      return getRecipes(userId);
    },
  });
}

/**
 * Hook to fetch a single recipe by ID
 */
export function useRecipe(id: string): UseQueryResult<Recipe | null, Error> {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: async () => {
      const { getRecipe } = await import('./server');
      return getRecipe(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new recipe
 * Includes optimistic updates for immediate UI feedback
 */
export function useCreateRecipe(): UseMutationResult<
  Recipe,
  Error,
  RecipeInsert
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRecipeAction,
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
export function useUpdateRecipe(): UseMutationResult<
  Recipe,
  Error,
  { id: string; data: RecipeUpdate }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateRecipeAction(id, data),
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
export function useDeleteRecipe(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipeAction,
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
