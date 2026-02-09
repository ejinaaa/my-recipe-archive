import { Suspense } from 'react';
import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getRecipe } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { getCategoryGroups } from '@/entities/category/api/server';
import { categoryKeys } from '@/entities/category/api/keys';
import { getCurrentProfile } from '@/entities/user/api/server';
import { profileKeys } from '@/entities/user/api/keys';
import { RecipeEditPage, RecipeEditSkeleton } from '@/views/recipe-edit';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: recipeKeys.detail(id),
      queryFn: () => getRecipe(id),
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKeys.groups(),
      queryFn: getCategoryGroups,
    }),
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getCurrentProfile,
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
