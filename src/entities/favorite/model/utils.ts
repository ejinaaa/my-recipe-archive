import type { Favorite, FavoriteDB } from './types';

/**
 * Converts a database favorite to an application favorite
 */
export const toFavorite = (dbFavorite: FavoriteDB): Favorite => {
  return {
    id: dbFavorite.id,
    user_id: dbFavorite.user_id,
    recipe_id: dbFavorite.recipe_id,
    created_at: new Date(dbFavorite.created_at),
  };
};
