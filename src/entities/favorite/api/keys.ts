/**
 * Query keys factory for favorites
 */
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (userId: string) => [...favoriteKeys.lists(), userId] as const,
  statuses: () => [...favoriteKeys.all, 'status'] as const,
  status: (userId: string, recipeId: string) =>
    [...favoriteKeys.statuses(), userId, recipeId] as const,
  batchStatuses: (userId: string, recipeIds: string[]) =>
    [
      ...favoriteKeys.statuses(),
      userId,
      'batch',
      recipeIds.sort().join(','),
    ] as const,
};
