// Server-side API
export {
  getCategoryOptions,
  getCategoryOption,
  getCategoryGroups,
  createCategoryOption,
  updateCategoryOption,
  deleteCategoryOption,
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
  useCategoryOptions,
  useCategoryOption,
  useCategoryGroups,
  useSuspenseCategoryGroups,
  useCreateCategoryOption,
  useUpdateCategoryOption,
  useDeleteCategoryOption,
} from './hooks';

// Re-export types for convenience
export type {
  CategoryOption,
  CategoryOptionInsert,
  CategoryOptionUpdate,
  CategoryType,
  CategoryGroup,
} from '../model/types';
