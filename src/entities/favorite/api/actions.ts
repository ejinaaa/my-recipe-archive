'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/config';
import { addFavorite, removeFavorite, isFavorited } from './server';

/**
 * Server Action: 즐겨찾기 토글
 */
export async function toggleFavoriteAction(
  userId: string,
  recipeId: string
): Promise<boolean> {
  try {
    const favorited = await isFavorited(userId, recipeId);

    if (favorited) {
      await removeFavorite(userId, recipeId);
    } else {
      await addFavorite(userId, recipeId);
    }

    revalidatePath(ROUTES.RECIPES.DETAIL(recipeId));
    return !favorited;
  } catch (error) {
    console.error('[Favorite Actions] toggleFavoriteAction error:', error);
    throw error;
  }
}

