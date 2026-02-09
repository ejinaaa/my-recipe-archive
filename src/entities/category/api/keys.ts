import type { CategoryType } from '../model/types';

/**
 * Query keys factory for category options
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (type?: CategoryType) => [...categoryKeys.lists(), { type }] as const,
  groups: () => [...categoryKeys.all, 'groups'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};
