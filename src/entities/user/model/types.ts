/**
 * User Profile Types
 * Generated from Supabase profiles table schema
 */

/**
 * Database representation of a user profile
 * Matches the profiles table schema in Supabase
 */
export interface ProfileDB {
  /** Unique identifier (UUID) */
  id: string;
  /** User's nickname */
  nickname: string | null;
  /** URL to user's profile image */
  image_url: string | null;
  /** Last update timestamp */
  updated_at: string | null;
}

/**
 * Application-level user profile type
 * Converts nullable fields to optional for better TypeScript ergonomics
 */
export interface Profile {
  /** Unique identifier (UUID) */
  id: string;
  /** User's nickname */
  nickname?: string;
  /** URL to user's profile image */
  image_url?: string;
  /** Last update timestamp */
  updated_at?: Date;
}

/**
 * Type for creating a new profile
 * ID is required as it comes from auth.users
 */
export interface ProfileInsert {
  /** Unique identifier (UUID) from auth.users */
  id: string;
  /** User's nickname */
  nickname?: string;
  /** URL to user's profile image */
  image_url?: string;
}

/**
 * Type for updating an existing profile
 * All fields are optional except id
 */
export interface ProfileUpdate {
  /** User's nickname */
  nickname?: string;
  /** URL to user's profile image */
  image_url?: string;
}

/**
 * Converts a database profile to an application profile
 */
export function toProfile(dbProfile: ProfileDB): Profile {
  return {
    id: dbProfile.id,
    ...(dbProfile.nickname && { nickname: dbProfile.nickname }),
    ...(dbProfile.image_url && { image_url: dbProfile.image_url }),
    ...(dbProfile.updated_at && { updated_at: new Date(dbProfile.updated_at) }),
  };
}
