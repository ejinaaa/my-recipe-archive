'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/config';
import type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  incrementViewCount,
} from './server';

/**
 * Server Action: Create a new recipe
 * Automatically revalidates the recipes page after creation
 */
export async function createRecipeAction(data: RecipeInsert): Promise<Recipe> {
  try {
    const recipe = await createRecipe(data);

    // Revalidate related pages
    revalidatePath(ROUTES.RECIPES.LIST);
    revalidatePath(ROUTES.RECIPES.DETAIL(recipe.id));

    return recipe;
  } catch (error) {
    console.error('[Recipe Actions] createRecipeAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Update an existing recipe
 * Automatically revalidates the recipe pages after update
 */
export async function updateRecipeAction(
  id: string,
  data: RecipeUpdate
): Promise<Recipe> {
  try {
    const recipe = await updateRecipe(id, data);

    // Revalidate related pages
    revalidatePath(ROUTES.RECIPES.LIST);
    revalidatePath(ROUTES.RECIPES.DETAIL(id));

    return recipe;
  } catch (error) {
    console.error('[Recipe Actions] updateRecipeAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Delete a recipe
 * Automatically revalidates the recipes page after deletion
 */
export async function deleteRecipeAction(id: string): Promise<void> {
  try {
    await deleteRecipe(id);

    // Revalidate related pages
    revalidatePath(ROUTES.RECIPES.LIST);
    revalidatePath(ROUTES.RECIPES.DETAIL(id));
  } catch (error) {
    console.error('[Recipe Actions] deleteRecipeAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Increment view count
 * 하루에 유저당 1회만 카운트됨
 */
export async function incrementViewCountAction(
  recipeId: string,
  userId: string
): Promise<void> {
  await incrementViewCount(recipeId, userId);
}
