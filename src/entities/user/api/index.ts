// Server-side API
export {
  getProfileApi,
  getCurrentProfileApi,
  createProfileApi,
  updateProfileApi,
  deleteProfileApi,
} from './server';

// Server Actions (mutation only)
export {
  createProfileAction,
  updateProfileAction,
  deleteProfileAction,
} from './actions';

// Client fetch functions
export { fetchCurrentProfile, fetchProfile } from './client';

// Query keys
export { profileKeys } from './keys';

// Client-side React Query hooks
export {
  useProfileQuery,
  useCurrentProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} from './hooks';

// Re-export types for convenience
export type { Profile, ProfileInsert, ProfileUpdate } from '../model/types';
