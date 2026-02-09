'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import {
  SearchBar,
  SortButton,
  FilterButton,
  FilterBottomSheet,
  SortBottomSheet,
  ActiveFilterBadges,
  useUrlQueryParams,
  toCategoryFilter,
  toCookingTimeRange,
  isSortActive,
  isFilterActive,
} from '@/features/recipe-search';
import { BackButton } from '@/shared/ui/back-button';
import { PageHeader } from '@/shared/ui/page-header';
import { ROUTES } from '@/shared/config';
import { useSaveUrlOnUnmount } from '@/shared/lib';
import { useNavigationStore } from '@/shared/model';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList, RecipeListSkeleton } from '@/widgets/recipe-list';
import { ErrorFallback } from '@/shared/ui/error-fallback';

export function SearchResultsPage() {
  const router = useRouter();
  const setLastSearchUrl = useNavigationStore(s => s.setLastSearchUrl);

  // 언마운트 시 현재 URL을 전역 상태에 저장 (네비게이션 복귀용)
  useSaveUrlOnUnmount(setLastSearchUrl);

  // URL 쿼리 파라미터에서 상태 읽기/쓰기
  const {
    searchQuery,
    sortBy,
    categoryFilters,
    cookingTimeRange,
    setSearchQuery,
    setSortBy,
    setFilters,
    resetSort,
    removeCategoryFilter,
    removeCookingTime,
    filterOrder,
  } = useUrlQueryParams();

  // 바텀시트 열림 상태 (로컬)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleBack = () => {
    router.push(ROUTES.SEARCH);
  };

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  const handleSortClick = () => {
    setIsSortOpen(true);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  return (
    <div className='min-h-screen pb-20 bg-background'>
      {/* Header */}
      <PageHeader className='py-3'>
        <div className='flex items-center gap-2'>
          <BackButton onBack={handleBack} />
          <SearchBar
            defaultValue={searchQuery ?? undefined}
            onSearch={handleSearch}
            placeholder='어떤 요리를 찾으세요?'
          />
          <SortButton
            onClick={handleSortClick}
            isActive={isSortActive(sortBy)}
          />
          <FilterButton
            onClick={handleFilterClick}
            isActive={isFilterActive(categoryFilters, cookingTimeRange)}
          />
        </div>
      </PageHeader>

      {/* Active Filter Badges */}
      <ActiveFilterBadges
        sortBy={sortBy}
        categoryFilters={categoryFilters}
        cookingTimeRange={cookingTimeRange}
        filterOrder={filterOrder}
        onRemoveSort={resetSort}
        onRemoveCategoryFilter={removeCategoryFilter}
        onRemoveCookingTime={removeCookingTime}
      />

      {/* Main */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<RecipeListSkeleton />}>
          <RecipeList
            searchQuery={searchQuery ?? undefined}
            categories={toCategoryFilter(categoryFilters)}
            cookingTimeRange={toCookingTimeRange(cookingTimeRange)}
            sortBy={sortBy ?? undefined}
          />
        </Suspense>
      </ErrorBoundary>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab='search' />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        initialFilters={categoryFilters}
        initialCookingTime={cookingTimeRange ?? undefined}
        onApply={setFilters}
      />

      {/* Sort Bottom Sheet */}
      <SortBottomSheet
        open={isSortOpen}
        onOpenChange={setIsSortOpen}
        initialSortBy={sortBy ?? 'latest'}
        onApply={setSortBy}
      />
    </div>
  );
}
