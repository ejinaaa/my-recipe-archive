import { Suspense } from 'react';
import { getCategoryGroups } from '@/entities/category/api/server';
import { RecipeEditPage, RecipeEditSkeleton } from '@/views/recipe-edit';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const categoryGroups = await getCategoryGroups();

  return (
    <Suspense fallback={<RecipeEditSkeleton />}>
      <RecipeEditPage id={id} categoryGroups={categoryGroups} />
    </Suspense>
  );
}
