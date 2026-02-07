import { Suspense } from 'react';
import { FavoritesPage } from '@/views/favorites';

// API Route를 사용하므로 빌드 시 static generation 불가
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense>
      <FavoritesPage />
    </Suspense>
  );
}
