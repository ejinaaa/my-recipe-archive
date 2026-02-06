'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import {
  SearchBar,
  SortButton,
  FilterButton,
  FilterBottomSheet,
  useFilterStore,
  useRecipeFilters,
} from '@/features/recipe-search';
import type { CategoryType } from '@/entities/category/model/types';
import { BackButton } from '@/shared/ui/back-button';
import { ROUTES } from '@/shared/config';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList } from '@/widgets/recipe-list';
import { RecipeListError } from '@/widgets/recipe-list/ui/RecipeListError';

export function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터
  const query = searchParams.get('q') || '';
  const categoryType = searchParams.get('type') as CategoryType | null;
  const categoryCode = searchParams.get('code') || '';

  // Filter store
  const { initializeFromUrl } = useFilterStore();
  const { categoryFilter, cookingTimeFilter, openBottomSheet } =
    useRecipeFilters();

  // URL 파라미터로 store 초기화
  useEffect(() => {
    initializeFromUrl(categoryType, categoryCode);
  }, [categoryType, categoryCode, initializeFromUrl]);

  // URL 쿼리에서 카테고리 필터 생성 (store 필터가 없을 때 fallback)
  const urlCategoryFilter =
    categoryType && categoryCode
      ? { [categoryType]: categoryCode }
      : undefined;

  // store의 필터와 URL 필터 병합 (store 우선)
  const finalCategoryFilter = categoryFilter || urlCategoryFilter;

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
          cookingTimeRange={cookingTimeFilter}
        />
      </ErrorBoundary>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab='search' />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet />
    </div>
  );
}
