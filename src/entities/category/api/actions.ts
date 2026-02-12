'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/shared/config';
import type {
  CategoryOption,
  CategoryOptionInsert,
  CategoryOptionUpdate,
} from '../model/types';
import {
  createCategoryOptionApi,
  updateCategoryOptionApi,
  deleteCategoryOptionApi,
} from './server';

/**
 * Server Action: Create a new category option
 * Automatically revalidates related pages after creation
 */
export async function createCategoryOptionAction(
  data: CategoryOptionInsert
): Promise<CategoryOption> {
  try {
    const option = await createCategoryOptionApi(data);

    // Revalidate pages that use categories
    revalidatePath(ROUTES.RECIPES.LIST);
    revalidatePath('/categories');

    return option;
  } catch (error) {
    console.error(
      '[Category Actions] createCategoryOptionAction error:',
      error
    );
    throw error;
  }
}

/**
 * Server Action: Update an existing category option
 * Automatically revalidates related pages after update
 */
export async function updateCategoryOptionAction(
  id: number,
  data: CategoryOptionUpdate
): Promise<CategoryOption> {
  try {
    const option = await updateCategoryOptionApi(id, data);

    // Revalidate pages that use categories
    revalidatePath(ROUTES.RECIPES.LIST);
    revalidatePath('/categories');

    return option;
  } catch (error) {
    console.error(
      '[Category Actions] updateCategoryOptionAction error:',
      error
    );
    throw error;
  }
}

/**
 * Server Action: Delete a category option
 * Automatically revalidates related pages after deletion
 */
export async function deleteCategoryOptionAction(id: number): Promise<void> {
  try {
    await deleteCategoryOptionApi(id);

    // Revalidate pages that use categories
    revalidatePath(ROUTES.RECIPES.LIST);
    revalidatePath('/categories');
  } catch (error) {
    console.error(
      '[Category Actions] deleteCategoryOptionAction error:',
      error
    );
    throw error;
  }
}
