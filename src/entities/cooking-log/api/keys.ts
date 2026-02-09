/**
 * Query keys factory for cooking logs
 */
export const cookingLogKeys = {
  all: ['cooking-logs'] as const,
  lists: () => [...cookingLogKeys.all, 'list'] as const,
  list: (userId: string) => [...cookingLogKeys.lists(), userId] as const,
  counts: () => [...cookingLogKeys.all, 'count'] as const,
  count: (userId: string, recipeId: string) =>
    [...cookingLogKeys.counts(), userId, recipeId] as const,
  userCounts: (userId: string) =>
    [...cookingLogKeys.counts(), userId, 'all'] as const,
};
