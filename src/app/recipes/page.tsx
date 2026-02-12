import {
  createServerQueryClient,
  dehydrate,
  HydrationBoundary,
} from '@/shared/lib/prefetch';
import { getCurrentProfileApi } from '@/entities/user/api/server';
import { profileKeys } from '@/entities/user/api/keys';
import { getRecipesPaginatedApi, getRandomRecipeApi } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { getCategoryGroupsApi } from '@/entities/category/api/server';
import { categoryKeys } from '@/entities/category/api/keys';
import { RecipesPage } from '@/views/recipes';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const queryClient = createServerQueryClient();

  await Promise.all([
    // 프로필
    queryClient.prefetchQuery({
      queryKey: profileKeys.current(),
      queryFn: getCurrentProfileApi,
    }),
    // 오늘의 추천 레시피
    queryClient.prefetchQuery({
      queryKey: recipeKeys.random(),
      queryFn: getRandomRecipeApi,
    }),
    // 많이 해본 요리 섹션
    queryClient.prefetchQuery({
      queryKey: recipeKeys.section('most_cooked'),
      queryFn: async () => {
        const data = await getRecipesPaginatedApi({ sortBy: 'most_cooked', limit: 6 });
        return data.recipes;
      },
    }),
    // 더 도전해볼 요리 섹션
    queryClient.prefetchQuery({
      queryKey: recipeKeys.section('least_cooked'),
      queryFn: async () => {
        const data = await getRecipesPaginatedApi({ sortBy: 'least_cooked', limit: 6 });
        return data.recipes;
      },
    }),
    // 최근 추가한 레시피 섹션
    queryClient.prefetchQuery({
      queryKey: recipeKeys.section('latest'),
      queryFn: async () => {
        const data = await getRecipesPaginatedApi({ sortBy: 'latest', limit: 6 });
        return data.recipes;
      },
    }),
    // 카테고리
    queryClient.prefetchQuery({
      queryKey: categoryKeys.groups(),
      queryFn: getCategoryGroupsApi,
    }),
    // 전체 레시피 (무한 스크롤)
    queryClient.prefetchInfiniteQuery({
      queryKey: recipeKeys.infinite({}),
      queryFn: ({ pageParam }) =>
        getRecipesPaginatedApi({ offset: pageParam as number }),
      initialPageParam: 0,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipesPage />
    </HydrationBoundary>
  );
}
