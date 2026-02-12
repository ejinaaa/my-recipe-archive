import { useEffect } from 'react';
import { useIncrementViewCountMutation } from '@/entities/recipe/api/hooks';

/**
 * 페이지 진입 시 조회수를 증가시키는 훅
 */
export function useTrackViewCount(recipeId: string, userId?: string) {
  const incrementViewCount = useIncrementViewCountMutation();

  useEffect(() => {
    if (userId) {
      incrementViewCount.mutate({ recipeId, userId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId, userId]);
}
