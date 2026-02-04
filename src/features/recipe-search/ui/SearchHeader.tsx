'use client';

import { useState } from 'react';
import { BackButton } from './BackButton';
import { SearchBar } from './SearchBar';
import { SortButton } from './SortButton';
import { FilterButton } from './FilterButton';

interface SearchHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onBackClick?: () => void;
  onSortClick?: () => void;
  onFilterClick?: () => void;
}

export function SearchHeader({
  searchQuery: controlledSearchQuery,
  onSearchChange,
  onBackClick,
  onSortClick,
  onFilterClick,
}: SearchHeaderProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const setSearchQuery = onSearchChange ?? setInternalSearchQuery;

  return (
    <header className='sticky top-0 z-10 bg-background px-2 pt-2 pb-3'>
      <div className='flex items-center gap-1'>
        {onBackClick && <BackButton onClick={onBackClick} />}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <SortButton onClick={onSortClick} />
        <FilterButton onClick={onFilterClick} />
      </div>
    </header>
  );
}
