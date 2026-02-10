import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { RecipeListSkeleton } from '@/widgets/recipe-list';
import { SearchResultsPage } from './SearchResultsPage';

/**
 * 성공 케이스용 QueryClient: 레시피 목록 + 프로필 캐시 세팅
 *
 * recipeKeys.infinite({}) 사용: URL 파라미터가 없으면
 * 모든 필터 값이 undefined → JSON 직렬화 시 빈 객체와 동일
 */
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  // useSuspenseInfiniteRecipes 캐시 (RecipeList 내부)
  queryClient.setQueryData(recipeKeys.infinite({}), {
    pages: [{ recipes: mockRecipes.slice(0, 6), hasMore: false }],
    pageParams: [0],
  });

  // useCurrentProfile (RecipeList 내부)
  queryClient.setQueryData(profileKeys.current(), {
    id: 'user-1',
    nickname: '요리사',
  });

  return queryClient;
}

/**
 * 에러 케이스용 QueryClient: 캐시 비어 있음 + retry 꺼짐
 * fetch 실패 → ErrorBoundary → QueryErrorFallback 표시
 */
function createErrorQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

const meta = {
  title: 'views/search-results/SearchResultsPage',
  component: SearchResultsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchResultsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 검색 결과 목록 정상 표시
 */
export const Default: Story = {
  decorators: [
    Story => {
      const queryClient = createSuccessQueryClient();
      return (
        <NuqsTestingAdapter>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<RecipeListSkeleton />}>
              <Story />
            </Suspense>
          </QueryClientProvider>
        </NuqsTestingAdapter>
      );
    },
  ],
};

/**
 * 에러 상태: QueryErrorFallback (Skeleton + ErrorBottomSheet) 표시
 */
export const Error: Story = {
  decorators: [
    Story => {
      const queryClient = createErrorQueryClient();
      return (
        <NuqsTestingAdapter>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </NuqsTestingAdapter>
      );
    },
  ],
};
