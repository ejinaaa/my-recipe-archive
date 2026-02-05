/**
 * Favorite Types
 * 즐겨찾기 관련 타입 정의
 */

/**
 * Database representation of a favorite
 */
export interface FavoriteDB {
  /** Unique identifier (UUID) */
  id: string;
  /** User ID who favorited (UUID) */
  user_id: string;
  /** Recipe ID that was favorited (UUID) */
  recipe_id: string;
  /** Creation timestamp */
  created_at: string;
}

/**
 * Application-level favorite type
 */
export interface Favorite {
  /** Unique identifier (UUID) */
  id: string;
  /** User ID who favorited (UUID) */
  user_id: string;
  /** Recipe ID that was favorited (UUID) */
  recipe_id: string;
  /** Creation timestamp */
  created_at: Date;
}

/**
 * Converts a database favorite to an application favorite
 */
export function toFavorite(dbFavorite: FavoriteDB): Favorite {
  return {
    id: dbFavorite.id,
    user_id: dbFavorite.user_id,
    recipe_id: dbFavorite.recipe_id,
    created_at: new Date(dbFavorite.created_at),
  };
}
