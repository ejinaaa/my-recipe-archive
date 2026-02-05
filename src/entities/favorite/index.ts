// Types
export type { Favorite, FavoriteDB } from './model/types';
export { toFavorite } from './model/types';

// Server API
export {
  addFavorite,
  removeFavorite,
  isFavorited,
  getFavoriteStatuses,
  getFavoriteRecipes,
} from './api/server';

// Server Actions
export {
  addFavoriteAction,
  removeFavoriteAction,
  toggleFavoriteAction,
  isFavoritedAction,
  getFavoriteStatusesAction,
  getFavoriteRecipesAction,
} from './api/actions';

// Hooks
export {
  favoriteKeys,
  useIsFavorited,
  useFavoriteStatuses,
  useFavoriteRecipes,
  useToggleFavorite,
} from './api/hooks';
