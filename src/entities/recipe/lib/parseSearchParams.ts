import type { CategoryFilter } from '../model/types';
import type { InfiniteRecipesParams } from '../api/keys';
import { COOKING_TIME_MIN, COOKING_TIME_MAX } from '../model/constants';

type RawSearchParams = Record<string, string | string[] | undefined>;

/**
 * URL 쿼리 파라미터를 InfiniteRecipesParams로 파싱
 * search/results, favorites 등 레시피 목록 페이지에서 공통 사용
 */
export const parseSearchParams = (
  params: RawSearchParams
): Pick<
  InfiniteRecipesParams,
  'searchQuery' | 'sortBy' | 'categories' | 'cookingTimeRange'
> => {
  const searchQuery = (params.q as string) || undefined;
  const sortBy =
    (params.sort as InfiniteRecipesParams['sortBy']) || undefined;

  const categories: CategoryFilter | undefined = (() => {
    const result: CategoryFilter = {};
    if (params.situation)
      result.situation = (params.situation as string).split(',');
    if (params.cuisine)
      result.cuisine = (params.cuisine as string).split(',');
    if (params.dishType)
      result.dishType = (params.dishType as string).split(',');
    return Object.keys(result).length > 0 ? result : undefined;
  })();

  const cookingTimeRange = (() => {
    const min = params.timeMin
      ? parseInt(params.timeMin as string)
      : undefined;
    const max = params.timeMax
      ? parseInt(params.timeMax as string)
      : undefined;
    return min !== undefined || max !== undefined
      ? { min: min ?? COOKING_TIME_MIN, max: max ?? COOKING_TIME_MAX }
      : undefined;
  })();

  return { searchQuery, sortBy, categories, cookingTimeRange };
};
