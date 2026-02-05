'use server';

import { revalidatePath } from 'next/cache';
import type { Profile, ProfileInsert, ProfileUpdate } from '../model/types';
import {
  createProfile,
  updateProfile,
  deleteProfile,
  getCurrentProfile,
  getProfile,
} from './server';

/**
 * Server Action: Get profile by ID
 */
export async function getProfileAction(id: string): Promise<Profile | null> {
  try {
    return await getProfile(id);
  } catch (error) {
    console.error('[Profile Actions] getProfileAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Get current authenticated user's profile
 */
export async function getCurrentProfileAction(): Promise<Profile | null> {
  try {
    return await getCurrentProfile();
  } catch (error) {
    console.error('[Profile Actions] getCurrentProfileAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Create a new profile
 * Automatically revalidates related pages after creation
 */
export async function createProfileAction(
  data: ProfileInsert
): Promise<Profile> {
  try {
    const profile = await createProfile(data);

    // Revalidate profile pages
    revalidatePath('/profile');
    revalidatePath(`/profile/${profile.id}`);

    return profile;
  } catch (error) {
    console.error('[Profile Actions] createProfileAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Update an existing profile
 * Automatically revalidates related pages after update
 */
export async function updateProfileAction(
  id: string,
  data: ProfileUpdate
): Promise<Profile> {
  try {
    const profile = await updateProfile(id, data);

    // Revalidate profile pages
    revalidatePath('/profile');
    revalidatePath(`/profile/${id}`);

    return profile;
  } catch (error) {
    console.error('[Profile Actions] updateProfileAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Delete a profile
 * Automatically revalidates related pages after deletion
 */
export async function deleteProfileAction(id: string): Promise<void> {
  try {
    await deleteProfile(id);

    // Revalidate profile pages
    revalidatePath('/profile');
    revalidatePath(`/profile/${id}`);
  } catch (error) {
    console.error('[Profile Actions] deleteProfileAction error:', error);
    throw error;
  }
}
