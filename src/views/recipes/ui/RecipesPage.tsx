'use client';

import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchBar, SortButton, FilterButton } from '@/features/recipe-search';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList } from '@/widgets/recipe-list';
import { RecipeListError } from '@/widgets/recipe-list/ui/RecipeListError';

export function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='min-h-screen pb-20 bg-background'>
      <header className='sticky top-0 z-10 bg-background px-2 pt-2 pb-3'>
        <div className='flex items-center gap-1'>
          <SearchBar defaultValue={searchQuery} onSearch={setSearchQuery} />
          <SortButton />
          <FilterButton />
        </div>
      </header>

      <ErrorBoundary
        FallbackComponent={RecipeListError}
        resetKeys={[searchQuery]}
      >
        <RecipeList searchQuery={searchQuery} />
      </ErrorBoundary>

      <BottomNavigation activeTab='search' />
    </div>
  );
}
