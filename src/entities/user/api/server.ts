import { createClient } from '@/shared/api/supabase/server';
import type {
  Profile,
  ProfileDB,
  ProfileInsert,
  ProfileUpdate,
} from '../model/types';

/**
 * Get a profile by user ID
 */
export async function getProfile(id: string): Promise<Profile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('[Profile API] Failed to fetch profile:', error);
      throw new Error('프로필 정보를 가져오지 못했어요');
    }

    const { toProfile } = await import('../model/types');
    return toProfile(data as ProfileDB);
  } catch (error) {
    console.error('[Profile API] getProfile error:', error);
    throw error;
  }
}

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Profile API] Failed to get current user:', authError);
      return null;
    }

    // Get user's profile
    return getProfile(user.id);
  } catch (error) {
    console.error('[Profile API] getCurrentProfile error:', error);
    throw error;
  }
}

/**
 * Create a new profile
 */
export async function createProfile(data: ProfileInsert): Promise<Profile> {
  try {
    const supabase = await createClient();

    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('[Profile API] Failed to create profile:', error);
      throw new Error('프로필을 만들지 못했어요');
    }

    const { toProfile } = await import('../model/types');
    return toProfile(newProfile as ProfileDB);
  } catch (error) {
    console.error('[Profile API] createProfile error:', error);
    throw error;
  }
}

/**
 * Update an existing profile
 */
export async function updateProfile(
  id: string,
  data: ProfileUpdate
): Promise<Profile> {
  try {
    const supabase = await createClient();

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Profile API] Failed to update profile:', error);
      throw new Error('프로필을 수정하지 못했어요');
    }

    const { toProfile } = await import('../model/types');
    return toProfile(updatedProfile as ProfileDB);
  } catch (error) {
    console.error('[Profile API] updateProfile error:', error);
    throw error;
  }
}

/**
 * Delete a profile
 */
export async function deleteProfile(id: string): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      console.error('[Profile API] Failed to delete profile:', error);
      throw new Error('프로필을 삭제하지 못했어요');
    }
  } catch (error) {
    console.error('[Profile API] deleteProfile error:', error);
    throw error;
  }
}
