'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseCategoryGroupsQuery } from '@/entities/category/api/hooks';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import { type CategoryType, getOptionsByType } from '@/entities/category/model/types';
import { CategoryChip } from '@/entities/category/ui/CategoryChip';
import { CategoryCard } from '@/entities/category/ui';
import { SearchBar } from '@/features/recipe-search';
import { ROUTES } from '@/shared/config';
import { useSaveUrlOnUnmount } from '@/shared/lib';
import { useNavigationStore } from '@/shared/model';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { PageContent } from '@/shared/ui/page-content';
import { PageHeader } from '@/shared/ui/page-header';
import { QueryErrorFallback } from '@/shared/ui/query-error-fallback';
import { Section, SectionHeader } from '@/shared/ui/section';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { SearchPageSkeleton } from './SearchPageSkeleton';

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
  const { data: categoryGroups } = useSuspenseCategoryGroupsQuery();

  const cuisines = getOptionsByType(categoryGroups, 'cuisine');
  const situations = getOptionsByType(categoryGroups, 'situation');
  const dishTypes = getOptionsByType(categoryGroups, 'dishType');

  return (
    <>
      {/* Header */}
      <PageHeader>
        <SearchBar onSearch={onSearch} placeholder='어떤 요리를 찾으세요?' />
      </PageHeader>

      {/* Main */}
      <PageContent className='space-y-6 py-6'>
        <Section>
          <SectionHeader title={CATEGORY_TYPE_LABELS.cuisine} />
          <HorizontalScroll className='gap-2 px-4'>
            {cuisines.map(cuisine => (
              <CategoryChip
                key={cuisine.id}
                category={cuisine}
                onClick={() => onCuisineSelect(cuisine.code)}
              />
            ))}
          </HorizontalScroll>
        </Section>

        <Section>
          <SectionHeader title={CATEGORY_TYPE_LABELS.situation} />
          <div className='grid grid-cols-2 gap-3 px-4'>
            {situations.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => onCategorySelect('situation', category.code)}
              />
            ))}
          </div>
        </Section>

        <Section>
          <SectionHeader title={CATEGORY_TYPE_LABELS.dishType} />
          <div className='grid grid-cols-2 gap-3 px-4'>
            {dishTypes.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => onCategorySelect('dishType', category.code)}
              />
            ))}
          </div>
        </Section>
      </PageContent>
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
