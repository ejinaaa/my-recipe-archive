import { Suspense } from 'react';
import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getCurrentProfile } from '@/entities/user/api/server';
import { profileKeys } from '@/entities/user/api/keys';
import { getRecipesPaginated } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { getCategoryGroups } from '@/entities/category/api/server';
import { categoryKeys } from '@/entities/category/api/keys';
import type { CategoryFilter } from '@/entities/recipe/api/server';
import type { InfiniteRecipesParams } from '@/entities/recipe/api/keys';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
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

  // URL 쿼리 파라미터를 클라이언트 useUrlQueryParams와 동일한 형태로 파싱
  const searchQuery =
    (resolvedSearchParams.q as string) || undefined;
  const sortBy =
    (resolvedSearchParams.sort as InfiniteRecipesParams['sortBy']) || undefined;

  const categories: CategoryFilter | undefined = (() => {
    const result: CategoryFilter = {};
    if (resolvedSearchParams.situation)
      result.situation = (resolvedSearchParams.situation as string).split(',');
    if (resolvedSearchParams.cuisine)
      result.cuisine = (resolvedSearchParams.cuisine as string).split(',');
    if (resolvedSearchParams.dishType)
      result.dishType = (resolvedSearchParams.dishType as string).split(',');
    return Object.keys(result).length > 0 ? result : undefined;
  })();

  const cookingTimeRange = (() => {
    const min = resolvedSearchParams.timeMin
      ? parseInt(resolvedSearchParams.timeMin as string)
      : undefined;
    const max = resolvedSearchParams.timeMax
      ? parseInt(resolvedSearchParams.timeMax as string)
      : undefined;
    return min !== undefined || max !== undefined
      ? { min: min ?? COOKING_TIME_MIN, max: max ?? COOKING_TIME_MAX }
      : undefined;
  })();

  const infiniteParams: InfiniteRecipesParams = {
    searchQuery,
    categories,
    cookingTimeRange,
    sortBy,
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getCurrentProfile,
    }),
    queryClient.prefetchQuery({
      queryKey: categoryKeys.groups(),
      queryFn: getCategoryGroups,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: recipeKeys.infinite(infiniteParams),
      queryFn: ({ pageParam }) =>
        getRecipesPaginated({ ...infiniteParams, offset: pageParam as number }),
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
