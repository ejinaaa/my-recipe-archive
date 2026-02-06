'use client';

import {
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from 'nuqs';
import type { RecipeSortBy } from '@/entities/recipe/api/server';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import type { CategoryFilters, CookingTimeRange } from './store';

const SORT_OPTIONS_VALUES: RecipeSortBy[] = [
  'latest',
  'oldest',
  'popular',
  'unpopular',
  'favorites',
];

/**
 * URL 쿼리 파라미터에서 검색/필터/정렬 상태를 읽고 쓰는 훅
 *
 * URL이 Source of Truth로 동작하며, 브라우저 히스토리/새로고침/URL 공유를 지원
 */
export function useUrlQueryParams() {
  const [params, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      sort: parseAsStringEnum<RecipeSortBy>(SORT_OPTIONS_VALUES),
      situation: parseAsString,
      cuisine: parseAsString,
      dishType: parseAsString,
      timeMin: parseAsInteger,
      timeMax: parseAsInteger,
    },
    {
      shallow: true,
    },
  );

  // URL 파라미터를 CategoryFilters 형식으로 변환
  const categoryFilters: CategoryFilters = {
    situation: params.situation ? [params.situation] : [],
    cuisine: params.cuisine ? [params.cuisine] : [],
    dishType: params.dishType ? [params.dishType] : [],
  };

  const cookingTimeRange: CookingTimeRange | null =
    params.timeMin !== null && params.timeMax !== null
      ? {
          min: params.timeMin,
          max: params.timeMax,
        }
      : null;

  return {
    // 읽기 (현재 URL 값)
    searchQuery: params.q,
    sortBy: params.sort,
    categoryFilters,
    cookingTimeRange,

    // 쓰기 (URL 업데이트)
    setSearchQuery: (q: string) => setParams({ q: q || null }),
    setSortBy: (sort: RecipeSortBy) => setParams({ sort }),
    setFilters: (filters: CategoryFilters, cookingTime: CookingTimeRange) =>
      setParams({
        situation: filters.situation[0] || null,
        cuisine: filters.cuisine[0] || null,
        dishType: filters.dishType[0] || null,
        timeMin: cookingTime.min === COOKING_TIME_MIN ? null : cookingTime.min,
        timeMax: cookingTime.max === COOKING_TIME_MAX ? null : cookingTime.max,
      }),
    resetFilters: () =>
      setParams({
        situation: null,
        cuisine: null,
        dishType: null,
        timeMin: null,
        timeMax: null,
      }),
  };
}
