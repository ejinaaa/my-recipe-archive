import type { Profile, ProfileDB } from './types';

/**
 * Converts a database profile to an application profile
 */
export const toProfile = (dbProfile: ProfileDB): Profile => {
  return {
    id: dbProfile.id,
    ...(dbProfile.nickname && { nickname: dbProfile.nickname }),
    ...(dbProfile.image_url && { image_url: dbProfile.image_url }),
    ...(dbProfile.updated_at && { updated_at: new Date(dbProfile.updated_at) }),
  };
};
