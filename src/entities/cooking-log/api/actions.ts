'use server';

import { revalidatePath } from 'next/cache';
import type { CookingLog } from '../model/types';
import { addCookingLog, deleteCookingLog } from './server';

/**
 * Server Action: 요리 완료 기록 추가
 */
export async function addCookingLogAction(
  userId: string,
  recipeId: string
): Promise<CookingLog> {
  try {
    const log = await addCookingLog(userId, recipeId);
    revalidatePath(`/recipes/${recipeId}`);
    return log;
  } catch (error) {
    console.error('[CookingLog Actions] addCookingLogAction error:', error);
    throw error;
  }
}

/**
 * Server Action: 요리 기록 삭제
 */
export async function deleteCookingLogAction(
  logId: string,
  recipeId: string
): Promise<void> {
  try {
    await deleteCookingLog(logId);
    revalidatePath(`/recipes/${recipeId}`);
  } catch (error) {
    console.error('[CookingLog Actions] deleteCookingLogAction error:', error);
    throw error;
  }
}
