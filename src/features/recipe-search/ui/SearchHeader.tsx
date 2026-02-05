'use client';

import { BackButton } from '@/shared/ui/back-button';
import { SearchBar } from './SearchBar';
import { SortButton } from './SortButton';
import { FilterButton } from './FilterButton';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onBackClick?: () => void;
  onSortClick?: () => void;
  onFilterClick?: () => void;
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  onSearch,
  onBackClick,
  onSortClick,
  onFilterClick,
}: SearchHeaderProps) {
  return (
    <header className='sticky top-0 z-10 bg-background px-2 pt-2 pb-3'>
      <div className='flex items-center gap-1'>
        {onBackClick && <BackButton onBack={onBackClick} />}
        <SearchBar value={searchQuery} onChange={onSearchChange} onSearch={onSearch} />
        <SortButton onClick={onSortClick} />
        <FilterButton onClick={onFilterClick} />
      </div>
    </header>
  );
}
