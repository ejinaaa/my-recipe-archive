import { Suspense } from 'react';
import { FavoritesPage } from '@/views/favorites';

export default function Page() {
  return (
    <Suspense>
      <FavoritesPage />
    </Suspense>
  );
}
