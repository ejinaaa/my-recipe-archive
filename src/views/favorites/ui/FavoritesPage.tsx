'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Heart } from 'lucide-react';
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

import { useCurrentProfile } from '@/entities/user/api/hooks';
import { recipeKeys } from '@/entities/recipe/api';
import { PageHeader } from '@/shared/ui/page-header';
import { useSaveUrlOnUnmount } from '@/shared/lib';
import { useNavigationStore } from '@/shared/model';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList, RecipeListSkeleton } from '@/widgets/recipe-list';
import { ErrorFallback } from '@/shared/ui/error-fallback';

const favoritesEmptyState = (
  <div className='flex flex-col items-center justify-center py-20 px-3'>
    <Heart className='size-12 text-text-secondary mb-4' />
    <p className='text-body-1 text-text-secondary text-center'>
      아직 즐겨찾기한 레시피가 없어요
    </p>
    <p className='text-body-2 text-text-secondary text-center mt-1'>
      마음에 드는 레시피를 찾아 저장해 보세요
    </p>
  </div>
);

export function FavoritesPage() {
  const queryClient = useQueryClient();
  const setLastFavoritesUrl = useNavigationStore(s => s.setLastFavoritesUrl);

  // 언마운트 시 현재 URL을 전역 상태에 저장 (네비게이션 복귀용)
  useSaveUrlOnUnmount(setLastFavoritesUrl);

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

  const { data: currentProfile } = useCurrentProfile();
  const userId = currentProfile?.id;

  // 페이지 진입 시 레시피 목록 쿼리 무효화 (즐겨찾기 변경사항 반영)
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: recipeKeys.lists(),
      exact: false,
    });
  }, [queryClient]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
            favoritesByUserId={userId}
            emptyState={favoritesEmptyState}
          />
        </Suspense>
      </ErrorBoundary>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab='favorites' />

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
