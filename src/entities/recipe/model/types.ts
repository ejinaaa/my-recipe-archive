/**
 * Recipe Types
 * Generated from Supabase recipes table schema
 */

import type {
  CategoryType,
  SituationCode,
  CuisineCode,
  DishTypeCode,
} from '../../category/model/types';

/**
 * Ingredient item in a recipe
 */
export interface Ingredient {
  /** Ingredient name */
  name: string;
  /** Amount/quantity */
  amount: string;
  /** Optional unit of measurement */
  unit?: string;
}

/**
 * Cooking step in a recipe
 */
export interface CookingStep {
  /** Step number */
  step: number;
  /** Step description */
  description: string;
  /** Optional image URL for this step */
  image_url?: string;
}

/**
 * Category information for a recipe
 * Discriminated union that ensures type-safe code based on type
 */
export type RecipeCategory =
  | {
      /** 상황별 카테고리 */
      type: 'situation';
      /** 상황 코드 */
      code: SituationCode;
      /** 카테고리 이름 */
      name: string;
    }
  | {
      /** 장르/나라별 카테고리 */
      type: 'cuisine';
      /** 장르 코드 */
      code: CuisineCode;
      /** 카테고리 이름 */
      name: string;
    }
  | {
      /** 요리 종류별 카테고리 */
      type: 'dishType';
      /** 요리 종류 코드 */
      code: DishTypeCode;
      /** 카테고리 이름 */
      name: string;
    };

/**
 * Database representation of a recipe
 * Matches the recipes table schema in Supabase
 */
export interface RecipeDB {
  /** Unique identifier (UUID) */
  id: string;
  /** User ID who created the recipe (UUID) */
  user_id: string;
  /** Recipe title */
  title: string;
  /** Recipe description */
  description: string | null;
  /** Thumbnail image URL */
  thumbnail_url: string | null;
  /** Cooking time in minutes */
  cooking_time: number | null;
  /** Number of servings */
  servings: number | null;
  /** Categories as JSON object (keyed by category type) */
  categories: Partial<Record<CategoryType, RecipeCategory>>;
  /** Ingredients as JSON array */
  ingredients: Ingredient[];
  /** Cooking steps as JSON array */
  steps: CookingStep[];
  /** Whether the recipe is public */
  is_public: boolean;
  /** View count */
  view_count: number;
  /** Favorite count */
  favorite_count: number;
  /** Cook count (총 요리 횟수, 트리거로 자동 갱신) */
  cook_count: number;
  /** Tags for search */
  tags: string[];
  /** Creation timestamp */
  created_at: string | null;
  /** Last update timestamp */
  updated_at: string | null;
}

/**
 * Application-level recipe type
 * Converts nullable fields to optional for better TypeScript ergonomics
 */
export interface Recipe {
  /** Unique identifier (UUID) */
  id: string;
  /** User ID who created the recipe (UUID) */
  user_id: string;
  /** Recipe title */
  title: string;
  /** Recipe description */
  description?: string;
  /** Thumbnail image URL */
  thumbnail_url?: string;
  /** Cooking time in minutes */
  cooking_time?: number;
  /** Number of servings */
  servings?: number;
  /** Recipe categories */
  categories: RecipeCategory[];
  /** Recipe ingredients */
  ingredients: Ingredient[];
  /** Cooking steps */
  steps: CookingStep[];
  /** Whether the recipe is public */
  is_public: boolean;
  /** View count */
  view_count: number;
  /** Favorite count */
  favorite_count: number;
  /** Cook count (총 요리 횟수) */
  cook_count: number;
  /** Tags for search */
  tags: string[];
  /** Creation timestamp */
  created_at?: Date;
  /** Last update timestamp */
  updated_at?: Date;
}

/**
 * Type for creating a new recipe
 */
export interface RecipeInsert {
  /** User ID who creates the recipe (UUID) */
  user_id: string;
  /** Recipe title */
  title: string;
  /** Recipe description */
  description?: string;
  /** Thumbnail image URL */
  thumbnail_url?: string;
  /** Cooking time in minutes */
  cooking_time?: number;
  /** Number of servings */
  servings?: number;
  /** Recipe categories */
  categories?: RecipeCategory[];
  /** Recipe ingredients */
  ingredients?: Ingredient[];
  /** Cooking steps */
  steps?: CookingStep[];
  /** Whether the recipe is public */
  is_public?: boolean;
  /** Tags for search */
  tags?: string[];
}

/**
 * Type for updating an existing recipe
 * All fields are optional
 */
export interface RecipeUpdate {
  /** Recipe title */
  title?: string;
  /** Recipe description */
  description?: string;
  /** Thumbnail image URL */
  thumbnail_url?: string;
  /** Cooking time in minutes */
  cooking_time?: number;
  /** Number of servings */
  servings?: number;
  /** Recipe categories */
  categories?: RecipeCategory[];
  /** Recipe ingredients */
  ingredients?: Ingredient[];
  /** Cooking steps */
  steps?: CookingStep[];
  /** Whether the recipe is public */
  is_public?: boolean;
  /** Tags for search */
  tags?: string[];
}

/**
 * Converts a database recipe to an application recipe
 */
export function toRecipe(dbRecipe: RecipeDB): Recipe {
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
      : Object.values(dbRecipe.categories || {}).filter(
          (cat): cat is RecipeCategory => cat !== undefined,
        ),
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
}

/**
 * Converts an application recipe to database format
 */
export function toRecipeDB(
  recipe: RecipeInsert | RecipeUpdate,
  user_id?: string,
): Partial<RecipeDB> {
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
    result.categories = recipe.categories.reduce((acc, cat) => {
      acc[cat.type] = cat;
      return acc;
    }, {} as Record<CategoryType, RecipeCategory>);
  }
  if (recipe.ingredients !== undefined) result.ingredients = recipe.ingredients;
  if (recipe.steps !== undefined) result.steps = recipe.steps;
  if (recipe.is_public !== undefined) result.is_public = recipe.is_public;
  if (recipe.tags !== undefined) result.tags = recipe.tags;

  return result;
}
