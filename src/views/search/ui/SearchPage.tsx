'use client';

import { useRouter } from 'next/navigation';
import { useCategoryGroups } from '@/entities/category/api/hooks';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import type { CategoryType } from '@/entities/category/model/types';
import { SearchBar } from '@/features/recipe-search';
import { ROUTES } from '@/shared/config';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { CuisineBadgeSection } from './CuisineBadgeSection';
import { CategoryCardSection } from './CategoryCardSection';

export function SearchPage() {
  const router = useRouter();
  const { data: categoryGroups, isLoading } = useCategoryGroups();

  // 카테고리 그룹 분리
  const cuisineGroup = categoryGroups?.find(g => g.type === 'cuisine');
  const situationGroup = categoryGroups?.find(g => g.type === 'situation');
  const dishTypeGroup = categoryGroups?.find(g => g.type === 'dishType');

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
    <div className='min-h-screen pb-20 bg-background'>
      {/* Header */}
      <header className='px-4 pt-4 pb-6'>
        <SearchBar
          onSearch={handleSearch}
          placeholder='어떤 요리를 찾으세요?'
        />
      </header>

      {/* Main */}
      <main className='space-y-6 pb-6'>
        {/* 장르별 섹션 */}
        <CuisineBadgeSection
          cuisines={cuisineGroup?.options ?? []}
          onSelect={handleCuisineSelect}
          isLoading={isLoading}
        />

        {/* 상황별 섹션 */}
        <CategoryCardSection
          title={CATEGORY_TYPE_LABELS.situation}
          type='situation'
          categories={situationGroup?.options ?? []}
          onSelect={handleCategorySelect}
          isLoading={isLoading}
        />

        {/* 종류별 섹션 */}
        <CategoryCardSection
          title={CATEGORY_TYPE_LABELS.dishType}
          type='dishType'
          categories={dishTypeGroup?.options ?? []}
          onSelect={handleCategorySelect}
          isLoading={isLoading}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab='search' />
    </div>
  );
}
