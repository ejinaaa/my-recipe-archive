import { createClient } from '@/shared/api/supabase/server';
import type {
  Recipe,
  RecipeDB,
  RecipeInsert,
  RecipeUpdate,
} from '../model/types';

/** 정렬 옵션 */
export type RecipeSortBy =
  | 'latest'
  | 'oldest'
  | 'most_cooked'
  | 'least_cooked'
  | 'most_viewed'
  | 'least_viewed'
  | 'favorites';

/** 카테고리 필터 */
export interface CategoryFilter {
  situation?: string[];
  cuisine?: string[];
  dishType?: string[];
}

/** 조리 시간 범위 필터 */
export interface CookingTimeRange {
  min?: number;
  max?: number;
}

export interface GetRecipesParams {
  userId?: string;
  limit?: number;
  offset?: number;
  searchQuery?: string;
  /** 공개 레시피만 조회 */
  isPublic?: boolean;
  /** 카테고리 필터 */
  categories?: CategoryFilter;
  /** 조리 시간 범위 */
  cookingTimeRange?: CookingTimeRange;
  /** 태그 필터 (AND 조건) */
  tags?: string[];
  /** 정렬 기준 */
  sortBy?: RecipeSortBy;
  /** 해당 유저가 즐겨찾기한 레시피만 조회 */
  favoritesByUserId?: string;
}

export interface PaginatedRecipes {
  recipes: Recipe[];
  total: number;
  hasMore: boolean;
}

/**
 * Get recipes with pagination support
 */
export async function getRecipesPaginated(
  params: GetRecipesParams = {},
): Promise<PaginatedRecipes> {
  try {
    const {
      userId,
      limit = 6,
      offset = 0,
      searchQuery,
      isPublic,
      categories,
      cookingTimeRange,
      tags,
      sortBy = 'latest',
      favoritesByUserId,
    } = params;
    const supabase = await createClient();

    // 즐겨찾기 필터가 있으면 먼저 즐겨찾기한 recipe_id 목록 조회
    let favoriteRecipeIds: string[] | undefined;
    if (favoritesByUserId) {
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('recipe_id')
        .eq('user_id', favoritesByUserId);

      if (favError) {
        console.error('[Recipe API] Failed to fetch favorites:', favError);
        throw new Error('즐겨찾기 목록을 불러오는데 실패했습니다.');
      }

      favoriteRecipeIds = favorites?.map(f => f.recipe_id) || [];

      // 즐겨찾기가 없으면 빈 결과 반환
      if (favoriteRecipeIds.length === 0) {
        return { recipes: [], total: 0, hasMore: false };
      }
    }

    let query = supabase.from('recipes').select('*', { count: 'exact' });

    // 즐겨찾기 필터
    if (favoriteRecipeIds) {
      query = query.in('id', favoriteRecipeIds);
    }

    // 유저 ID 필터
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // 공개 여부 필터
    if (isPublic !== undefined) {
      query = query.eq('is_public', isPublic);
    }

    // 텍스트 검색 (제목, 설명, 태그)
    if (searchQuery?.trim()) {
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
      );
    }

    // 카테고리 필터 (JSONB 배열 containment 쿼리)
    if (categories?.situation?.length) {
      const situationFilter = categories.situation
        .map(code => `categories->situation.cs.[{"code":"${code}"}]`)
        .join(',');
      query = query.or(situationFilter);
    }
    if (categories?.cuisine?.length) {
      const cuisineFilter = categories.cuisine
        .map(code => `categories->cuisine.cs.[{"code":"${code}"}]`)
        .join(',');
      query = query.or(cuisineFilter);
    }
    if (categories?.dishType?.length) {
      const dishTypeFilter = categories.dishType
        .map(code => `categories->dishType.cs.[{"code":"${code}"}]`)
        .join(',');
      query = query.or(dishTypeFilter);
    }

    // 조리 시간 범위 필터
    if (cookingTimeRange?.min !== undefined) {
      query = query.gte('cooking_time', cookingTimeRange.min);
    }
    if (cookingTimeRange?.max !== undefined) {
      query = query.lte('cooking_time', cookingTimeRange.max);
    }

    // 태그 필터 (배열에 모든 태그 포함)
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }

    // 정렬 (보조 정렬로 id 사용하여 동일한 값에서도 순서 보장)
    switch (sortBy) {
      case 'oldest':
        query = query
          .order('created_at', { ascending: true })
          .order('id', { ascending: true });
        break;
      case 'most_cooked':
        query = query
          .order('cook_count', { ascending: false })
          .order('id', { ascending: false });
        break;
      case 'least_cooked':
        query = query
          .order('cook_count', { ascending: true })
          .order('id', { ascending: true });
        break;
      case 'most_viewed':
        query = query
          .order('view_count', { ascending: false })
          .order('id', { ascending: false });
        break;
      case 'least_viewed':
        query = query
          .order('view_count', { ascending: true })
          .order('id', { ascending: true });
        break;
      case 'favorites':
        query = query
          .order('favorite_count', { ascending: false })
          .order('id', { ascending: false });
        break;
      case 'latest':
      default:
        query = query
          .order('created_at', { ascending: false })
          .order('id', { ascending: false });
        break;
    }

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (error) {
      console.error('[Recipe API] Failed to fetch recipes:', error);
      throw new Error('레시피 목록을 불러오는데 실패했습니다.');
    }

    const { toRecipe } = await import('../model/types');
    const recipes = (data as RecipeDB[]).map(toRecipe);
    const total = count || 0;

    return {
      recipes,
      total,
      hasMore: offset + recipes.length < total,
    };
  } catch (error) {
    console.error('[Recipe API] getRecipesPaginated error:', error);
    throw error;
  }
}

/**
 * Get all recipes, optionally filtered by user ID
 * For backward compatibility
 */
export async function getRecipes(userId?: string): Promise<Recipe[]> {
  const result = await getRecipesPaginated({ userId, limit: 1000 });
  return result.recipes;
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
  data: RecipeUpdate,
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

/**
 * 오늘의 추천 레시피 (날짜 기반 결정적 랜덤)
 * 같은 날에는 항상 동일한 레시피를 반환
 */
export async function getRandomRecipe(): Promise<Recipe | null> {
  try {
    const supabase = await createClient();

    // 전체 레시피 수 조회
    const { count } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    if (!count || count === 0) return null;

    // 날짜 기반 결정적 offset
    const today = new Date().toISOString().slice(0, 10);
    const seed = Array.from(today).reduce(
      (acc, ch) => acc * 31 + ch.charCodeAt(0),
      0,
    );
    const offset = Math.abs(seed) % count;

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: true })
      .range(offset, offset);

    if (error || !data?.[0]) return null;

    const { toRecipe } = await import('../model/types');
    return toRecipe(data[0] as RecipeDB);
  } catch (error) {
    console.error('[Recipe API] getRandomRecipe error:', error);
    return null;
  }
}

/**
 * Increment view count for a recipe
 * Uses RPC function to handle deduplication (1 view per user per day)
 */
export async function incrementViewCount(
  recipeId: string,
  userId: string,
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.rpc('increment_view_count', {
      p_recipe_id: recipeId,
      p_user_id: userId,
    });

    if (error) {
      console.error('[Recipe API] Failed to increment view count:', error);
      // 조회수 증가 실패는 치명적이지 않으므로 에러를 던지지 않음
    }
  } catch (error) {
    console.error('[Recipe API] incrementViewCount error:', error);
    // 조회수 증가 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}
