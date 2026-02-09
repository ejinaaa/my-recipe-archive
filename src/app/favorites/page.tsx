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
import type { CategoryFilter } from '@/entities/recipe/api/server';
import type { InfiniteRecipesParams } from '@/entities/recipe/api/keys';
import { FavoritesPage } from '@/views/favorites';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const queryClient = createServerQueryClient();

  // 프로필을 먼저 가져와서 userId를 즐겨찾기 prefetch에 사용
  const currentProfile = await getCurrentProfile();

  // URL 쿼리 파라미터 파싱 (즐겨찾기 페이지에서도 검색/필터 사용 가능)
  const searchQuery =
    (resolvedSearchParams.q as string) || undefined;
  const sortBy =
    (resolvedSearchParams.sort as InfiniteRecipesParams['sortBy']) || undefined;

  const categories: CategoryFilter | undefined = (() => {
    const result: CategoryFilter = {};
    if (resolvedSearchParams.situation)
      result.situation = resolvedSearchParams.situation as string;
    if (resolvedSearchParams.cuisine)
      result.cuisine = resolvedSearchParams.cuisine as string;
    if (resolvedSearchParams.dishType)
      result.dishType = resolvedSearchParams.dishType as string;
    return Object.keys(result).length > 0 ? result : undefined;
  })();

  const cookingTimeRange = (() => {
    const min = resolvedSearchParams.timeMin
      ? parseInt(resolvedSearchParams.timeMin as string)
      : undefined;
    const max = resolvedSearchParams.timeMax
      ? parseInt(resolvedSearchParams.timeMax as string)
      : undefined;
    return min !== undefined && max !== undefined
      ? { min, max }
      : undefined;
  })();

  const infiniteParams: InfiniteRecipesParams = {
    searchQuery,
    categories,
    cookingTimeRange,
    sortBy,
    favoritesByUserId: currentProfile?.id,
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: () => currentProfile,
    }),
    ...(currentProfile?.id
      ? [
          queryClient.prefetchInfiniteQuery({
            queryKey: recipeKeys.infinite(infiniteParams),
            queryFn: ({ pageParam }) =>
              getRecipesPaginated({
                ...infiniteParams,
                offset: pageParam as number,
              }),
            initialPageParam: 0,
          }),
        ]
      : []),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <FavoritesPage />
      </Suspense>
    </HydrationBoundary>
  );
}
