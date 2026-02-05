'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import {
  SearchBar,
  SortButton,
  FilterButton,
  FilterBottomSheet,
  useFilterStore,
} from '@/features/recipe-search';
import type { CategoryFilter } from '@/entities/recipe/api/server';
import { BackButton } from '@/shared/ui/back-button';
import { ROUTES } from '@/shared/config';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList } from '@/widgets/recipe-list';
import { RecipeListError } from '@/widgets/recipe-list/ui/RecipeListError';

/**
 * store의 CategoryFilters를 API의 CategoryFilter로 변환
 * 배열의 첫 번째 값만 사용
 */
function toCategoryFilter(filters: {
  situation: string[];
  cuisine: string[];
  dishType: string[];
}): CategoryFilter | undefined {
  const result: CategoryFilter = {};

  if (filters.situation.length > 0) {
    result.situation = filters.situation[0];
  }
  if (filters.cuisine.length > 0) {
    result.cuisine = filters.cuisine[0];
  }
  if (filters.dishType.length > 0) {
    result.dishType = filters.dishType[0];
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

export function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터
  const query = searchParams.get('q') || '';
  const categoryType = searchParams.get('type') as
    | 'situation'
    | 'cuisine'
    | 'dishType'
    | null;
  const categoryCode = searchParams.get('code') || '';

  // Filter store
  const { categoryFilters, cookingTimeRange, openBottomSheet } =
    useFilterStore();

  // URL 쿼리에서 카테고리 필터 생성
  const urlCategoryFilter: CategoryFilter | undefined =
    categoryType && categoryCode
      ? { [categoryType]: categoryCode }
      : undefined;

  // store의 필터와 URL 필터 병합 (store 우선)
  const storeCategoryFilter = toCategoryFilter(categoryFilters);
  const finalCategoryFilter = storeCategoryFilter || urlCategoryFilter;

  // 조리시간 범위 (기본값이 아닌 경우에만 적용)
  const finalCookingTimeRange =
    cookingTimeRange.min !== 0 || cookingTimeRange.max !== 120
      ? { min: cookingTimeRange.min, max: cookingTimeRange.max }
      : undefined;

  const handleBack = () => {
    router.push(ROUTES.SEARCH);
  };

  const handleSearch = (newQuery: string) => {
    router.push(`${ROUTES.SEARCH_RESULTS}?q=${encodeURIComponent(newQuery)}`);
  };

  const handleSortClick = () => {
    // TODO: sort 바텀시트 열기
  };

  const handleFilterClick = () => {
    openBottomSheet();
  };

  return (
    <div className='min-h-screen pb-20 bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-background px-4 py-3'>
        <div className='flex items-center gap-2'>
          <BackButton onBack={handleBack} />
          <SearchBar
            defaultValue={query}
            onSearch={handleSearch}
            placeholder='어떤 요리를 찾으세요?'
          />
          <SortButton onClick={handleSortClick} />
          <FilterButton onClick={handleFilterClick} />
        </div>
      </header>

      {/* Main */}
      <ErrorBoundary FallbackComponent={RecipeListError}>
        <RecipeList
          searchQuery={query}
          categories={finalCategoryFilter}
          cookingTimeRange={finalCookingTimeRange}
        />
      </ErrorBoundary>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab='search' />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet />
    </div>
  );
}
