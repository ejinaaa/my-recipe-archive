// Server-side API
export {
  getProfile,
  getCurrentProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from './server';

// Server Actions
export {
  createProfileAction,
  updateProfileAction,
  deleteProfileAction,
} from './actions';

// Client-side React Query hooks
export {
  useProfile,
  useCurrentProfile,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
  profileKeys,
} from './hooks';

// Re-export types for convenience
export type { Profile, ProfileInsert, ProfileUpdate } from '../model/types';
