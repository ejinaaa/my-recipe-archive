'use server';

import { revalidatePath } from 'next/cache';
import type {
  CategoryOption,
  CategoryOptionInsert,
  CategoryOptionUpdate,
  CategoryType,
  CategoryGroup,
} from '../model/types';
import {
  getCategoryOptions,
  getCategoryOption,
  getCategoryGroups,
  createCategoryOption,
  updateCategoryOption,
  deleteCategoryOption,
} from './server';

/**
 * Server Action: Get category options
 * 선택적으로 타입으로 필터링 가능
 */
export async function getCategoryOptionsAction(
  type?: CategoryType
): Promise<CategoryOption[]> {
  try {
    return await getCategoryOptions(type);
  } catch (error) {
    console.error('[Category Actions] getCategoryOptionsAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Get single category option by ID
 */
export async function getCategoryOptionAction(
  id: number
): Promise<CategoryOption | null> {
  try {
    return await getCategoryOption(id);
  } catch (error) {
    console.error('[Category Actions] getCategoryOptionAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Get category groups
 * 카테고리를 타입별로 그룹화하여 조회
 */
export async function getCategoryGroupsAction(): Promise<CategoryGroup[]> {
  try {
    return await getCategoryGroups();
  } catch (error) {
    console.error('[Category Actions] getCategoryGroupsAction error:', error);
    throw error;
  }
}

/**
 * Server Action: Create a new category option
 * Automatically revalidates related pages after creation
 */
export async function createCategoryOptionAction(
  data: CategoryOptionInsert
): Promise<CategoryOption> {
  try {
    const option = await createCategoryOption(data);

    // Revalidate pages that use categories
    revalidatePath('/recipes');
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
    const option = await updateCategoryOption(id, data);

    // Revalidate pages that use categories
    revalidatePath('/recipes');
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
    await deleteCategoryOption(id);

    // Revalidate pages that use categories
    revalidatePath('/recipes');
    revalidatePath('/categories');
  } catch (error) {
    console.error(
      '[Category Actions] deleteCategoryOptionAction error:',
      error
    );
    throw error;
  }
}
