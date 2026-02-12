import { Suspense } from 'react';
import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getRecipeApi } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { RecipeDetailPage, RecipeDetailSkeleton } from '@/views/recipe-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipeApi(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecipeDetailSkeleton />}>
        <RecipeDetailPage id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
