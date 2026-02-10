'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/config';
import type { Favorite } from '../model/types';
import { addFavorite, removeFavorite, isFavorited } from './server';

/**
 * Server Action: 즐겨찾기 추가
 */
export async function addFavoriteAction(
  userId: string,
  recipeId: string
): Promise<Favorite> {
  try {
    const favorite = await addFavorite(userId, recipeId);
    revalidatePath(ROUTES.RECIPES.DETAIL(recipeId));
    return favorite;
  } catch (error) {
    console.error('[Favorite Actions] addFavoriteAction error:', error);
    throw error;
  }
}

/**
 * Server Action: 즐겨찾기 삭제
 */
export async function removeFavoriteAction(
  userId: string,
  recipeId: string
): Promise<void> {
  try {
    await removeFavorite(userId, recipeId);
    revalidatePath(ROUTES.RECIPES.DETAIL(recipeId));
  } catch (error) {
    console.error('[Favorite Actions] removeFavoriteAction error:', error);
    throw error;
  }
}

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

