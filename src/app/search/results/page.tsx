import { Suspense } from 'react';
import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getCurrentProfileApi } from '@/entities/user/api/server';
import { profileKeys } from '@/entities/user/api/keys';
import { getRecipesPaginatedApi } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { parseSearchParams } from '@/entities/recipe/lib/parseSearchParams';
import { getCategoryGroupsApi } from '@/entities/category/api/server';
import { categoryKeys } from '@/entities/category/api/keys';
import type { InfiniteRecipesParams } from '@/entities/recipe/api/keys';
import { SearchResultsPage } from '@/views/search-results';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchResultsRoute({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const queryClient = createServerQueryClient();

  const infiniteParams: InfiniteRecipesParams = parseSearchParams(resolvedSearchParams);

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getCurrentProfileApi,
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKeys.groups(),
      queryFn: getCategoryGroupsApi,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: recipeKeys.infinite(infiniteParams),
      queryFn: ({ pageParam }) =>
        getRecipesPaginatedApi({ ...infiniteParams, offset: pageParam as number }),
      initialPageParam: 0,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <SearchResultsPage />
      </Suspense>
    </HydrationBoundary>
  );
}
