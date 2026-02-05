import { Suspense } from 'react';
import { RecipeDetailPage, RecipeDetailSkeleton } from '@/views/recipe-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<RecipeDetailSkeleton />}>
      <RecipeDetailPage id={id} />
    </Suspense>
  );
}
