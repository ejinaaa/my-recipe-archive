import { createClient } from '@/shared/api/supabase/server';
import type {
  CategoryOption,
  CategoryOptionDB,
  CategoryOptionInsert,
  CategoryOptionUpdate,
  CategoryType,
  CategoryGroup,
} from '../model/types';

/**
 * Get all category options, optionally filtered by type
 */
export async function getCategoryOptionsApi(
  type?: CategoryType
): Promise<CategoryOption[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('category_options').select('*');

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('sort_order', {
      ascending: true,
      nullsFirst: false,
    });

    if (error) {
      console.error('[Category API] Failed to fetch category options:', error);
      throw new Error('카테고리 정보를 가져오지 못했어요');
    }

    const { toCategoryOption } = await import('../model/types');
    return (data as CategoryOptionDB[]).map(toCategoryOption);
  } catch (error) {
    console.error('[Category API] getCategoryOptionsApi error:', error);
    throw error;
  }
}

/**
 * Get a single category option by ID
 */
export async function getCategoryOptionApi(
  id: number
): Promise<CategoryOption | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('category_options')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null;
      }
      console.error('[Category API] Failed to fetch category option:', error);
      throw new Error('카테고리 정보를 가져오지 못했어요');
    }

    const { toCategoryOption } = await import('../model/types');
    return toCategoryOption(data as CategoryOptionDB);
  } catch (error) {
    console.error('[Category API] getCategoryOptionApi error:', error);
    throw error;
  }
}

/**
 * Get category options grouped by type
 */
export async function getCategoryGroupsApi(): Promise<CategoryGroup[]> {
  try {
    const options = await getCategoryOptionsApi();
    const { groupCategoriesByType } = await import('../model/types');
    return groupCategoriesByType(options);
  } catch (error) {
    console.error('[Category API] getCategoryGroupsApi error:', error);
    throw error;
  }
}

/**
 * Create a new category option
 */
export async function createCategoryOptionApi(
  data: CategoryOptionInsert
): Promise<CategoryOption> {
  try {
    const supabase = await createClient();

    const { data: newOption, error } = await supabase
      .from('category_options')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('[Category API] Failed to create category option:', error);
      throw new Error('카테고리를 추가하지 못했어요');
    }

    const { toCategoryOption } = await import('../model/types');
    return toCategoryOption(newOption as CategoryOptionDB);
  } catch (error) {
    console.error('[Category API] createCategoryOptionApi error:', error);
    throw error;
  }
}

/**
 * Update an existing category option
 */
export async function updateCategoryOptionApi(
  id: number,
  data: CategoryOptionUpdate
): Promise<CategoryOption> {
  try {
    const supabase = await createClient();

    const { data: updatedOption, error } = await supabase
      .from('category_options')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Category API] Failed to update category option:', error);
      throw new Error('카테고리를 수정하지 못했어요');
    }

    const { toCategoryOption } = await import('../model/types');
    return toCategoryOption(updatedOption as CategoryOptionDB);
  } catch (error) {
    console.error('[Category API] updateCategoryOptionApi error:', error);
    throw error;
  }
}

/**
 * Delete a category option
 */
export async function deleteCategoryOptionApi(id: number): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('category_options')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Category API] Failed to delete category option:', error);
      throw new Error('카테고리를 삭제하지 못했어요');
    }
  } catch (error) {
    console.error('[Category API] deleteCategoryOptionApi error:', error);
    throw error;
  }
}
