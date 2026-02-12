// Server-side API
export {
  getCategoryOptionsApi,
  getCategoryOptionApi,
  getCategoryGroupsApi,
  createCategoryOptionApi,
  updateCategoryOptionApi,
  deleteCategoryOptionApi,
} from './server';

// Server Actions (mutation only)
export {
  createCategoryOptionAction,
  updateCategoryOptionAction,
  deleteCategoryOptionAction,
} from './actions';

// Client fetch functions
export {
  fetchCategoryGroups,
  fetchCategoryOptions,
  fetchCategoryOption,
} from './client';

// Query keys
export { categoryKeys } from './keys';

// Client-side React Query hooks
export {
  useCategoryOptionsQuery,
  useCategoryOptionQuery,
  useCategoryGroupsQuery,
  useSuspenseCategoryGroupsQuery,
  useCreateCategoryOptionMutation,
  useUpdateCategoryOptionMutation,
  useDeleteCategoryOptionMutation,
} from './hooks';

// Re-export types for convenience
export type {
  CategoryOption,
  CategoryOptionInsert,
  CategoryOptionUpdate,
  CategoryType,
  CategoryGroup,
} from '../model/types';
