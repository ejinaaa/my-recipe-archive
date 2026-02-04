// Server-side API
export {
  getCategoryOptions,
  getCategoryOption,
  getCategoryGroups,
  createCategoryOption,
  updateCategoryOption,
  deleteCategoryOption,
} from './server';

// Server Actions
export {
  createCategoryOptionAction,
  updateCategoryOptionAction,
  deleteCategoryOptionAction,
} from './actions';

// Client-side React Query hooks
export {
  useCategoryOptions,
  useCategoryOption,
  useCategoryGroups,
  useCreateCategoryOption,
  useUpdateCategoryOption,
  useDeleteCategoryOption,
  categoryKeys,
} from './hooks';

// Re-export types for convenience
export type {
  CategoryOption,
  CategoryOptionInsert,
  CategoryOptionUpdate,
  CategoryType,
  CategoryGroup,
} from '../model/types';
