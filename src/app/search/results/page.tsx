import { Suspense } from 'react';
import { SearchResultsPage } from '@/views/search-results';

// API Route를 사용하므로 빌드 시 static generation 불가
export const dynamic = 'force-dynamic';

export default function SearchResultsRoute() {
  return (
    <Suspense>
      <SearchResultsPage />
    </Suspense>
  );
}
