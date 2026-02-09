// Server-side API
export {
  getProfile,
  getCurrentProfile,
  createProfile,
  updateProfile,
  deleteProfile,
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
  useProfile,
  useCurrentProfile,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
} from './hooks';

// Re-export types for convenience
export type { Profile, ProfileInsert, ProfileUpdate } from '../model/types';
