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

// Server Actions (mutation only)
export {
  addFavoriteAction,
  removeFavoriteAction,
  toggleFavoriteAction,
} from './api/actions';

// Client fetch functions
export { fetchIsFavorited, fetchFavoriteStatuses } from './api/client';

// Query keys
export { favoriteKeys } from './api/keys';

// Hooks
export {
  useIsFavorited,
  useFavoriteStatuses,
  useToggleFavorite,
} from './api/hooks';
