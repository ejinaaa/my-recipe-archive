import { createClient } from '@/shared/api/supabase/server';
import type { Favorite, FavoriteDB } from '../model/types';
import type { Recipe, RecipeDB } from '@/entities/recipe/model/types';

/**
 * 즐겨찾기 추가
 */
export async function addFavorite(
  userId: string,
  recipeId: string
): Promise<Favorite> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, recipe_id: recipeId })
      .select()
      .single();

    if (error) {
      // 이미 존재하는 경우 (unique constraint)
      if (error.code === '23505') {
        throw new Error('이미 즐겨찾기에 추가된 레시피입니다.');
      }
      console.error('[Favorite API] Failed to add favorite:', error);
      throw new Error('즐겨찾기 추가에 실패했습니다.');
    }

    const { toFavorite } = await import('../model/types');
    return toFavorite(data as FavoriteDB);
  } catch (error) {
    console.error('[Favorite API] addFavorite error:', error);
    throw error;
  }
}

/**
 * 즐겨찾기 삭제
 */
export async function removeFavorite(
  userId: string,
  recipeId: string
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) {
      console.error('[Favorite API] Failed to remove favorite:', error);
      throw new Error('즐겨찾기 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('[Favorite API] removeFavorite error:', error);
    throw error;
  }
}

/**
 * 특정 레시피가 즐겨찾기되었는지 확인
 */
export async function isFavorited(
  userId: string,
  recipeId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .maybeSingle();

    if (error) {
      console.error('[Favorite API] Failed to check favorite:', error);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error('[Favorite API] isFavorited error:', error);
    return false;
  }
}

/**
 * 여러 레시피의 즐겨찾기 여부를 한 번에 확인
 */
export async function getFavoriteStatuses(
  userId: string,
  recipeIds: string[]
): Promise<Record<string, boolean>> {
  try {
    if (recipeIds.length === 0) return {};

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', userId)
      .in('recipe_id', recipeIds);

    if (error) {
      console.error('[Favorite API] Failed to get favorite statuses:', error);
      return {};
    }

    const favoritedIds = new Set(data?.map(f => f.recipe_id) || []);
    return recipeIds.reduce(
      (acc, id) => {
        acc[id] = favoritedIds.has(id);
        return acc;
      },
      {} as Record<string, boolean>
    );
  } catch (error) {
    console.error('[Favorite API] getFavoriteStatuses error:', error);
    return {};
  }
}

/**
 * 사용자의 즐겨찾기 목록 조회 (레시피 정보 포함)
 */
export async function getFavoriteRecipes(userId: string): Promise<Recipe[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('favorites')
      .select('recipe:recipes(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Favorite API] Failed to get favorite recipes:', error);
      throw new Error('즐겨찾기 목록을 불러오는데 실패했습니다.');
    }

    const { toRecipe } = await import('@/entities/recipe/model/types');
    return (data || [])
      .map(item => item.recipe as unknown as RecipeDB)
      .filter(Boolean)
      .map(toRecipe);
  } catch (error) {
    console.error('[Favorite API] getFavoriteRecipes error:', error);
    throw error;
  }
}
