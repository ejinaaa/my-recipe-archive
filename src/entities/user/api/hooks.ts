'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Profile, ProfileInsert, ProfileUpdate } from '../model/types';
import {
  getProfileAction,
  getCurrentProfileAction,
  createProfileAction,
  updateProfileAction,
  deleteProfileAction,
} from './actions';

/**
 * Query keys factory for profiles
 */
export const profileKeys = {
  all: ['profiles'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
};

/**
 * Hook to fetch a profile by ID
 */
export function useProfile(id: string): UseQueryResult<Profile | null, Error> {
  return useQuery({
    queryKey: profileKeys.detail(id),
    queryFn: () => getProfileAction(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch the current authenticated user's profile
 */
export function useCurrentProfile(): UseQueryResult<Profile | null, Error> {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: getCurrentProfileAction,
  });
}

/**
 * Hook to create a new profile
 * Includes optimistic updates for immediate UI feedback
 */
export function useCreateProfile(): UseMutationResult<
  Profile,
  Error,
  ProfileInsert
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProfileAction,
    onMutate: async newProfile => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: profileKeys.detail(newProfile.id),
      });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(
        profileKeys.detail(newProfile.id)
      );

      // Optimistically update to the new value
      const optimisticProfile: Profile = {
        id: newProfile.id,
        nickname: newProfile.nickname,
        image_url: newProfile.image_url,
        updated_at: new Date(),
      };

      queryClient.setQueryData(
        profileKeys.detail(newProfile.id),
        optimisticProfile
      );

      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(
          profileKeys.detail(newProfile.id),
          context.previousProfile
        );
      }
    },
    onSettled: data => {
      // Refetch after mutation
      if (data) {
        queryClient.invalidateQueries({
          queryKey: profileKeys.detail(data.id),
        });
      }
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

/**
 * Hook to update an existing profile
 * Includes optimistic updates for immediate UI feedback
 */
export function useUpdateProfile(): UseMutationResult<
  Profile,
  Error,
  { id: string; data: ProfileUpdate }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateProfileAction(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: profileKeys.detail(id) });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(profileKeys.detail(id));

      // Optimistically update to the new value
      queryClient.setQueryData<Profile>(profileKeys.detail(id), old => {
        if (!old) return old;
        return { ...old, ...data, updated_at: new Date() };
      });

      return { previousProfile };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(
          profileKeys.detail(id),
          context.previousProfile
        );
      }
    },
    onSettled: (data, error, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

/**
 * Hook to delete a profile
 */
export function useDeleteProfile(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfileAction,
    onSettled: (data, error, id) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}
