import { Suspense } from 'react';
import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getRecipeApi } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { getCategoryGroupsApi } from '@/entities/category/api/server';
import { categoryKeys } from '@/entities/category/api/keys';
import { getCurrentProfileApi } from '@/entities/user/api/server';
import { profileKeys } from '@/entities/user/api/keys';
import { RecipeEditPage, RecipeEditSkeleton } from '@/views/recipe-edit';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: recipeKeys.detail(id),
      queryFn: () => getRecipeApi(id),
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKeys.groups(),
      queryFn: getCategoryGroupsApi,
    }),
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getCurrentProfileApi,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecipeEditSkeleton />}>
        <RecipeEditPage id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
