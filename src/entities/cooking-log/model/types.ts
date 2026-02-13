/**
 * Cooking Log Types
 * 요리 기록 관련 타입 정의
 */

/**
 * Database representation of a cooking log
 */
export interface CookingLogDB {
  /** Unique identifier (UUID) */
  id: string;
  /** User ID who cooked (UUID) */
  user_id: string;
  /** Recipe ID that was cooked (UUID) */
  recipe_id: string;
  /** 실제로 요리한 시점 */
  cooked_at: string;
  /** Creation timestamp */
  created_at: string;
}

/**
 * Application-level cooking log type
 */
export interface CookingLog {
  /** Unique identifier (UUID) */
  id: string;
  /** User ID who cooked (UUID) */
  user_id: string;
  /** Recipe ID that was cooked (UUID) */
  recipe_id: string;
  /** 실제로 요리한 시점 */
  cooked_at: Date;
  /** Creation timestamp */
  created_at: Date;
}

/**
 * 특정 레시피의 유저별 요리 횟수
 */
export interface RecipeCookCount {
  recipe_id: string;
  count: number;
}
