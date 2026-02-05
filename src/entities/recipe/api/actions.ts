'use server';

import { revalidatePath } from 'next/cache';
import type { Recipe, RecipeInsert, RecipeUpdate } from '../model/types';
import {
  getRecipes,
  getRecipe,
  getRecipesPaginated,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  incrementViewCount,
} from './server';
import type { GetRecipesParams, PaginatedRecipes } from './server';

/**
 * Server Action: Get all recipes
 */
export async function getRecipesAction(userId?: string): Promise<Recipe[]> {
  return getRecipes(userId);
}

/**
 * Server Action: Get a single recipe
 */
export async function getRecipeAction(id: string): Promise<Recipe | null> {
  return getRecipe(id);
}

/**
 * Server Action: Get recipes with pagination
 */
export async function getRecipesPaginatedAction(
  params: GetRecipesParams = {}
): Promise<PaginatedRecipes> {
  return getRecipesPaginated(params);
}

/**
 * Server Action: Create a new recipe
 * Automatically revalidates the recipes page after creation
 */
export async function createRecipeAction(data: RecipeInsert): Promise<Recipe> {
  try {
    const recipe = await createRecipe(data);

    // Revalidate related pages
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${recipe.id}`);

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
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);

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
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);
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
