'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/config';
import { addFavoriteApi, removeFavoriteApi, isFavoritedApi } from './server';

/**
 * Server Action: 즐겨찾기 토글
 */
export async function toggleFavoriteAction(
  userId: string,
  recipeId: string
): Promise<boolean> {
  try {
    const favorited = await isFavoritedApi(userId, recipeId);

    if (favorited) {
      await removeFavoriteApi(userId, recipeId);
    } else {
      await addFavoriteApi(userId, recipeId);
    }

    revalidatePath(ROUTES.RECIPES.DETAIL(recipeId));
    return !favorited;
  } catch (error) {
    console.error('[Favorite Actions] toggleFavoriteAction error:', error);
    throw error;
  }
}

