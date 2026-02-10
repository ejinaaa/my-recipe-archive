'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import type { CategoryType } from '@/entities/category/model/types';
import { SearchBar } from '@/features/recipe-search';
import { ROUTES } from '@/shared/config';
import { useSaveUrlOnUnmount } from '@/shared/lib';
import { useNavigationStore } from '@/shared/model';
import { PageHeader } from '@/shared/ui/page-header';
import { QueryErrorFallback } from '@/shared/ui/query-error-fallback';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { SearchPageSkeleton } from './SearchPageSkeleton';
import { CuisineBadgeSection } from './CuisineBadgeSection';
import { CategoryCardSection } from './CategoryCardSection';

/**
 * 카테고리 데이터를 사용하는 검색 콘텐츠
 */
function SearchContent({
  onSearch,
  onCuisineSelect,
  onCategorySelect,
}: {
  onSearch: (query: string) => void;
  onCuisineSelect: (code: string) => void;
  onCategorySelect: (type: CategoryType, code: string) => void;
}) {
  const { data: categoryGroups } = useSuspenseCategoryGroups();

  const cuisineGroup = categoryGroups.find(g => g.type === 'cuisine');
  const situationGroup = categoryGroups.find(g => g.type === 'situation');
  const dishTypeGroup = categoryGroups.find(g => g.type === 'dishType');

  return (
    <>
      {/* Header */}
      <PageHeader className='pb-6'>
        <SearchBar
          onSearch={onSearch}
          placeholder='어떤 요리를 찾으세요?'
        />
      </PageHeader>

      {/* Main */}
      <main className='flex-1 overflow-y-auto space-y-6 pb-6'>
        <CuisineBadgeSection
          cuisines={cuisineGroup?.options ?? []}
          onSelect={onCuisineSelect}
        />
        <CategoryCardSection
          title={CATEGORY_TYPE_LABELS.situation}
          type='situation'
          categories={situationGroup?.options ?? []}
          onSelect={onCategorySelect}
        />
        <CategoryCardSection
          title={CATEGORY_TYPE_LABELS.dishType}
          type='dishType'
          categories={dishTypeGroup?.options ?? []}
          onSelect={onCategorySelect}
        />
      </main>
    </>
  );
}

export function SearchPage() {
  const router = useRouter();
  const setLastSearchUrl = useNavigationStore(s => s.setLastSearchUrl);

  useSaveUrlOnUnmount(setLastSearchUrl);

  const handleSearch = (query: string) => {
    router.push(`${ROUTES.SEARCH_RESULTS}?q=${encodeURIComponent(query)}`);
  };

  const handleCuisineSelect = (code: string) => {
    router.push(`${ROUTES.SEARCH_RESULTS}?cuisine=${code}`);
  };

  const handleCategorySelect = (type: CategoryType, code: string) => {
    router.push(`${ROUTES.SEARCH_RESULTS}?${type}=${code}`);
  };

  return (
    <div className='h-dvh flex flex-col bg-background'>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <QueryErrorFallback
            skeleton={<SearchPageSkeleton />}
            onRetry={resetErrorBoundary}
            onHome={() => router.push(ROUTES.RECIPES.LIST)}
            title='카테고리 정보를 가져오지 못했어요'
            description='네트워크 상태를 확인하고 다시 시도해주세요'
          />
        )}
      >
        <Suspense fallback={<SearchPageSkeleton />}>
          <SearchContent
            onSearch={handleSearch}
            onCuisineSelect={handleCuisineSelect}
            onCategorySelect={handleCategorySelect}
          />
        </Suspense>
      </ErrorBoundary>

      <BottomNavigation activeTab='search' />
    </div>
  );
}
