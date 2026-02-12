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
  /** Categories as JSON object (keyed by category type, each value is an array) */
  categories: Partial<Record<CategoryType, RecipeCategory[]>>;
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
