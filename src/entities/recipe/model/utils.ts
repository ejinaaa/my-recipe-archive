import type {
  CategoryType,
} from '../../category/model/types';
import type {
  RecipeDB,
  Recipe,
  RecipeCategory,
  RecipeInsert,
  RecipeUpdate,
} from './types';

/**
 * 분 단위를 "X시간 Y분" 형식으로 변환
 */
export const formatCookingTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${mins}분`;
};

/**
 * Converts a database recipe to an application recipe
 */
export const toRecipe = (dbRecipe: RecipeDB): Recipe => {
  return {
    id: dbRecipe.id,
    user_id: dbRecipe.user_id,
    title: dbRecipe.title,
    ...(dbRecipe.description && { description: dbRecipe.description }),
    ...(dbRecipe.thumbnail_url && { thumbnail_url: dbRecipe.thumbnail_url }),
    ...(dbRecipe.cooking_time && { cooking_time: dbRecipe.cooking_time }),
    ...(dbRecipe.servings && { servings: dbRecipe.servings }),
    categories: Array.isArray(dbRecipe.categories)
      ? dbRecipe.categories
      : Object.values(dbRecipe.categories || {})
          .flat()
          .filter((cat): cat is RecipeCategory => cat !== undefined),
    ingredients: dbRecipe.ingredients || [],
    steps: dbRecipe.steps || [],
    is_public: dbRecipe.is_public ?? false,
    view_count: dbRecipe.view_count ?? 0,
    favorite_count: dbRecipe.favorite_count ?? 0,
    cook_count: dbRecipe.cook_count ?? 0,
    tags: dbRecipe.tags || [],
    ...(dbRecipe.created_at && { created_at: new Date(dbRecipe.created_at) }),
    ...(dbRecipe.updated_at && { updated_at: new Date(dbRecipe.updated_at) }),
  };
};

/**
 * Converts an application recipe to database format
 */
export const toRecipeDB = (
  recipe: RecipeInsert | RecipeUpdate,
  user_id?: string,
): Partial<RecipeDB> => {
  const result: Partial<RecipeDB> = {};

  if ('user_id' in recipe) result.user_id = recipe.user_id;
  else if (user_id) result.user_id = user_id;

  if (recipe.title) result.title = recipe.title;
  if (recipe.description !== undefined)
    result.description = recipe.description || null;
  if (recipe.thumbnail_url !== undefined)
    result.thumbnail_url = recipe.thumbnail_url || null;
  if (recipe.cooking_time !== undefined)
    result.cooking_time = recipe.cooking_time || null;
  if (recipe.servings !== undefined) result.servings = recipe.servings || null;
  if (recipe.categories !== undefined) {
    result.categories = recipe.categories.reduce(
      (acc, cat) => {
        const list = acc[cat.type] ?? [];
        list.push(cat);
        acc[cat.type] = list;
        return acc;
      },
      {} as Record<CategoryType, RecipeCategory[]>,
    );
  }
  if (recipe.ingredients !== undefined) result.ingredients = recipe.ingredients;
  if (recipe.steps !== undefined) result.steps = recipe.steps;
  if (recipe.is_public !== undefined) result.is_public = recipe.is_public;
  if (recipe.tags !== undefined) result.tags = recipe.tags;

  return result;
};
