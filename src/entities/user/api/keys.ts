/**
 * Query keys factory for user profiles
 */
export const profileKeys = {
  all: ['profiles'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
};
