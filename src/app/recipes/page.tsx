import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getCurrentProfile } from '@/entities/user/api/server';
import { profileKeys } from '@/entities/user/api/keys';
import { getRecipesPaginated } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { RecipesPage } from '@/views/recipes';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getCurrentProfile,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: recipeKeys.infinite({}),
      queryFn: ({ pageParam }) =>
        getRecipesPaginated({ offset: pageParam as number }),
      initialPageParam: 0,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipesPage />
    </HydrationBoundary>
  );
}
