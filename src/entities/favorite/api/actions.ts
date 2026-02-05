'use server';

import { revalidatePath } from 'next/cache';
import type { Favorite } from '../model/types';
import type { Recipe } from '@/entities/recipe/model/types';
import {
  addFavorite,
  removeFavorite,
  isFavorited,
  getFavoriteStatuses,
  getFavoriteRecipes,
} from './server';

/**
 * Server Action: 즐겨찾기 추가
 */
export async function addFavoriteAction(
  userId: string,
  recipeId: string
): Promise<Favorite> {
  try {
    const favorite = await addFavorite(userId, recipeId);
    revalidatePath(`/recipes/${recipeId}`);
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
    revalidatePath(`/recipes/${recipeId}`);
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

    revalidatePath(`/recipes/${recipeId}`);
    return !favorited;
  } catch (error) {
    console.error('[Favorite Actions] toggleFavoriteAction error:', error);
    throw error;
  }
}

/**
 * Server Action: 즐겨찾기 여부 확인
 */
export async function isFavoritedAction(
  userId: string,
  recipeId: string
): Promise<boolean> {
  return isFavorited(userId, recipeId);
}

/**
 * Server Action: 여러 레시피의 즐겨찾기 여부 확인
 */
export async function getFavoriteStatusesAction(
  userId: string,
  recipeIds: string[]
): Promise<Record<string, boolean>> {
  return getFavoriteStatuses(userId, recipeIds);
}

/**
 * Server Action: 즐겨찾기 레시피 목록 조회
 */
export async function getFavoriteRecipesAction(
  userId: string
): Promise<Recipe[]> {
  return getFavoriteRecipes(userId);
}
