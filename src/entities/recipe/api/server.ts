import { createClient } from '@/shared/api/supabase/server';
import type {
  Recipe,
  RecipeDB,
  RecipeInsert,
  RecipeUpdate,
  toRecipe,
  toRecipeDB,
} from '../model/types';

/**
 * Get all recipes, optionally filtered by user ID
 */
export async function getRecipes(userId?: string): Promise<Recipe[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('recipes').select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('[Recipe API] Failed to fetch recipes:', error);
      throw new Error('레시피 목록을 불러오는데 실패했습니다.');
    }

    // Import the conversion function dynamically to avoid circular dependencies
    const { toRecipe } = await import('../model/types');
    return (data as RecipeDB[]).map(toRecipe);
  } catch (error) {
    console.error('[Recipe API] getRecipes error:', error);
    throw error;
  }
}

/**
 * Get a single recipe by ID
 */
export async function getRecipe(id: string): Promise<Recipe | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('[Recipe API] Failed to fetch recipe:', error);
      throw new Error('레시피를 불러오는데 실패했습니다.');
    }

    const { toRecipe } = await import('../model/types');
    return toRecipe(data as RecipeDB);
  } catch (error) {
    console.error('[Recipe API] getRecipe error:', error);
    throw error;
  }
}

/**
 * Create a new recipe
 */
export async function createRecipe(data: RecipeInsert): Promise<Recipe> {
  try {
    const supabase = await createClient();
    const { toRecipeDB, toRecipe } = await import('../model/types');

    const dbData = toRecipeDB(data);

    const { data: newRecipe, error } = await supabase
      .from('recipes')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('[Recipe API] Failed to create recipe:', error);
      throw new Error('레시피 생성에 실패했습니다.');
    }

    return toRecipe(newRecipe as RecipeDB);
  } catch (error) {
    console.error('[Recipe API] createRecipe error:', error);
    throw error;
  }
}

/**
 * Update an existing recipe
 */
export async function updateRecipe(
  id: string,
  data: RecipeUpdate
): Promise<Recipe> {
  try {
    const supabase = await createClient();
    const { toRecipeDB, toRecipe } = await import('../model/types');

    const dbData = toRecipeDB(data);

    const { data: updatedRecipe, error } = await supabase
      .from('recipes')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Recipe API] Failed to update recipe:', error);
      throw new Error('레시피 수정에 실패했습니다.');
    }

    return toRecipe(updatedRecipe as RecipeDB);
  } catch (error) {
    console.error('[Recipe API] updateRecipe error:', error);
    throw error;
  }
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('recipes').delete().eq('id', id);

    if (error) {
      console.error('[Recipe API] Failed to delete recipe:', error);
      throw new Error('레시피 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('[Recipe API] deleteRecipe error:', error);
    throw error;
  }
}
