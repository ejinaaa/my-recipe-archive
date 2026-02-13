import { createClient } from '@/shared/api/supabase/server';
import type { CookingLog, CookingLogDB, RecipeCookCount } from '../model/types';

/**
 * 요리 기록 추가
 */
export async function addCookingLogApi(
  userId: string,
  recipeId: string
): Promise<CookingLog> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cooking_logs')
    .insert({ user_id: userId, recipe_id: recipeId })
    .select()
    .single();

  if (error) {
    console.error('[CookingLog API] Failed to add cooking log:', error);
    throw new Error('요리 기록을 추가하지 못했어요');
  }

  const { toCookingLog } = await import('../model/utils');
  return toCookingLog(data as CookingLogDB);
}

/**
 * 요리 기록 삭제
 */
export async function deleteCookingLogApi(logId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cooking_logs')
    .delete()
    .eq('id', logId);

  if (error) {
    console.error('[CookingLog API] Failed to delete cooking log:', error);
    throw new Error('요리 기록을 삭제하지 못했어요');
  }
}

/**
 * 특정 유저의 특정 레시피 요리 횟수 조회
 */
export async function getCookCountApi(
  userId: string,
  recipeId: string
): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('cooking_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);

  if (error) {
    console.error('[CookingLog API] Failed to get cook count:', error);
    return 0;
  }

  return count ?? 0;
}

/**
 * 특정 유저의 모든 레시피별 요리 횟수 조회
 */
export async function getUserCookCountsApi(
  userId: string
): Promise<RecipeCookCount[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cooking_logs')
    .select('recipe_id')
    .eq('user_id', userId);

  if (error) {
    console.error('[CookingLog API] Failed to get user cook counts:', error);
    return [];
  }

  // recipe_id별 카운트 집계
  const countMap = (data || []).reduce(
    (acc, log) => {
      acc[log.recipe_id] = (acc[log.recipe_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(countMap).map(([recipe_id, count]) => ({
    recipe_id,
    count,
  }));
}

/**
 * 특정 유저의 특정 레시피 요리 기록 목록 조회
 */
export async function getCookingLogsApi(
  userId: string,
  recipeId: string
): Promise<CookingLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cooking_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('recipe_id', recipeId)
    .order('cooked_at', { ascending: false });

  if (error) {
    console.error('[CookingLog API] Failed to get cooking logs:', error);
    return [];
  }

  const { toCookingLog } = await import('../model/utils');
  return (data as CookingLogDB[]).map(toCookingLog);
}
