// Types
export type { Favorite, FavoriteDB } from './model/types';
export { toFavorite } from './model/types';

// Server API
export {
  addFavorite,
  removeFavorite,
  isFavorited,
  getFavoriteStatuses,
} from './api/server';

// Server Actions
export {
  addFavoriteAction,
  removeFavoriteAction,
  toggleFavoriteAction,
  isFavoritedAction,
  getFavoriteStatusesAction,
} from './api/actions';

// Hooks
export {
  favoriteKeys,
  useIsFavorited,
  useFavoriteStatuses,
  useToggleFavorite,
} from './api/hooks';
