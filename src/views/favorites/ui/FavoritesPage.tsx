'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Heart } from 'lucide-react';
import {
  SearchBar,
  SortButton,
  FilterButton,
  FilterBottomSheet,
  SortBottomSheet,
  useUrlQueryParams,
  toCategoryFilter,
  toCookingTimeRange,
  isSortActive,
  isFilterActive,
} from '@/features/recipe-search';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import { recipeKeys } from '@/entities/recipe/api/hooks';
import { BackButton } from '@/shared/ui/back-button';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList } from '@/widgets/recipe-list';
import { RecipeListError } from '@/widgets/recipe-list/ui/RecipeListError';

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
  const router = useRouter();
  const queryClient = useQueryClient();

  // URL 쿼리 파라미터에서 상태 읽기/쓰기
  const {
    searchQuery,
    sortBy,
    categoryFilters,
    cookingTimeRange,
    setSearchQuery,
    setSortBy,
    setFilters,
    resetFilters,
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

  const handleBack = () => {
    // TODO: favorite 검색 페이지와 분리되면 favorites 메인으로 이동하도록 수정
    router.back();
  };

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
      <header className='sticky top-0 z-10 bg-background px-4 py-3'>
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
      </header>

      {/* Main */}
      <ErrorBoundary FallbackComponent={RecipeListError}>
        <RecipeList
          searchQuery={searchQuery ?? undefined}
          categories={toCategoryFilter(categoryFilters)}
          cookingTimeRange={toCookingTimeRange(cookingTimeRange)}
          sortBy={sortBy ?? undefined}
          favoritesByUserId={userId}
          emptyState={favoritesEmptyState}
        />
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
        onApplyEmpty={resetFilters}
        requireFilter={false}
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
