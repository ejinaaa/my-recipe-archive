import { Suspense } from 'react';
import { SearchResultsPage } from '@/views/search-results';

export default function SearchResultsRoute() {
  return (
    <Suspense>
      <SearchResultsPage />
    </Suspense>
  );
}
