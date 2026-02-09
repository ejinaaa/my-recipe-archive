'use client';

import { useState, useEffect } from 'react';
import {
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from 'nuqs';
import type { RecipeSortBy } from '@/entities/recipe/api/server';
import type { CategoryType } from '@/entities/category/model/types';
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

/** 필터 순서 추적에 사용되는 키 */
export type FilterOrderKey = 'sort' | 'situation' | 'cuisine' | 'dishType' | 'cookingTime';

/**
 * URL 쿼리 파라미터에서 검색/필터/정렬 상태를 읽고 쓰는 훅
 *
 * URL이 Source of Truth로 동작하며, 브라우저 히스토리/새로고침/URL 공유를 지원
 */
export function useUrlQueryParams() {
  const [params, setParams] = useQueryStates(
    {
      q: parseAsString,
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

  // URL 파라미터를 CategoryFilters 형식으로 변환 (콤마 구분 복수 선택)
  const categoryFilters: CategoryFilters = {
    situation: params.situation ? params.situation.split(',') : [],
    cuisine: params.cuisine ? params.cuisine.split(',') : [],
    dishType: params.dishType ? params.dishType.split(',') : [],
  };

  // 한쪽만 설정되어도 cookingTimeRange 생성 (기본값으로 채움)
  const cookingTimeRange: CookingTimeRange | null =
    params.timeMin !== null || params.timeMax !== null
      ? {
          min: params.timeMin ?? COOKING_TIME_MIN,
          max: params.timeMax ?? COOKING_TIME_MAX,
        }
      : null;

  // params 객체에서 활성 필터 순서 파생 (hydration safe)
  const [filterOrder, setFilterOrder] = useState<FilterOrderKey[]>([]);

  useEffect(() => {
    const order: FilterOrderKey[] = [];
    if (params.sort !== null) order.push('sort');
    if (params.situation !== null) order.push('situation');
    if (params.cuisine !== null) order.push('cuisine');
    if (params.dishType !== null) order.push('dishType');
    if (params.timeMin !== null || params.timeMax !== null) order.push('cookingTime');
    setFilterOrder(order);
  }, [params.sort, params.situation, params.cuisine, params.dishType, params.timeMin, params.timeMax]);

  return {
    // 읽기 (현재 URL 값)
    searchQuery: params.q,
    sortBy: params.sort,
    categoryFilters,
    cookingTimeRange,
    filterOrder,

    // 쓰기 (URL 업데이트)
    setSearchQuery: (q: string) => setParams({ q: q || null }),
    setSortBy: (sort: RecipeSortBy) => setParams({ sort }),
    setFilters: (filters: CategoryFilters, cookingTime: CookingTimeRange) =>
      setParams({
        situation: filters.situation.length > 0 ? filters.situation.join(',') : null,
        cuisine: filters.cuisine.length > 0 ? filters.cuisine.join(',') : null,
        dishType: filters.dishType.length > 0 ? filters.dishType.join(',') : null,
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

    // 개별 제거 (Active Filter Badges용)
    resetSort: () => setParams({ sort: null }),
    removeCategoryFilter: (type: CategoryType, code: string) => {
      const current = categoryFilters[type].filter(c => c !== code);
      setParams({ [type]: current.length > 0 ? current.join(',') : null });
    },
    removeCookingTime: () => setParams({ timeMin: null, timeMax: null }),
  };
}
