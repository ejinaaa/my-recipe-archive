// Types
export type { Favorite, FavoriteDB } from './model/types';
export { toFavorite } from './model/types';

// Server API
export {
  addFavoriteApi,
  removeFavoriteApi,
  isFavoritedApi,
  getFavoriteStatusesApi,
} from './api/server';

// Server Actions (mutation only)
export { toggleFavoriteAction } from './api/actions';

// Client fetch functions
export { fetchIsFavorited, fetchFavoriteStatuses } from './api/client';

// Query keys
export { favoriteKeys } from './api/keys';

// Hooks
export {
  useIsFavoritedQuery,
  useFavoriteStatusesQuery,
  useRecipeFavoritesQuery,
  useToggleFavoriteMutation,
} from './api/hooks';
