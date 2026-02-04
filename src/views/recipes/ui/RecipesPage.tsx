'use client';

import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchHeader } from '@/features/recipe-search';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList } from '@/widgets/recipe-list';
import { RecipeListError } from '@/widgets/recipe-list/ui/RecipeListError';

export function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='min-h-screen pb-20 bg-background'>
      <SearchHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ErrorBoundary
        FallbackComponent={RecipeListError}
        resetKeys={[searchQuery]} // 검색어 변경 시 에러 리셋
      >
        <RecipeList searchQuery={searchQuery} />
      </ErrorBoundary>

      <BottomNavigation activeTab='search' />
    </div>
  );
}
