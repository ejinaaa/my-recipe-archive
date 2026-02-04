'use client';

import { useState } from 'react';
import { SearchHeader } from '@/features/recipe-search';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { RecipeList } from '@/widgets/recipe-list';
import { mockRecipes } from '@/entities/recipe/model/mock';

export function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='min-h-screen pb-20 bg-background'>
      <SearchHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <RecipeList recipes={mockRecipes} searchQuery={searchQuery} />
      <BottomNavigation activeTab='search' />
    </div>
  );
}
