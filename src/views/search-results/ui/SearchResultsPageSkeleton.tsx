import { SearchBar, SortButton, FilterButton } from '@/features/recipe-search';
import { BackButton } from '@/shared/ui/back-button';
import { PageHeader } from '@/shared/ui/page-header';
import { RecipeListSkeleton } from '@/widgets/recipe-list';

export function SearchResultsPageSkeleton() {
  return (
    <>
      <PageHeader className='py-3'>
        <div className='flex items-center gap-2'>
          <BackButton disabled />
          <SearchBar disabled onSearch={() => {}} />
          <SortButton disabled />
          <FilterButton disabled />
        </div>
      </PageHeader>
      <main className='flex-1 overflow-y-auto'>
        <RecipeListSkeleton />
      </main>
    </>
  );
}
