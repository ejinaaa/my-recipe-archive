import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { http, delay, HttpResponse } from 'msw';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { mockProfile } from '@/entities/user/model/mock';
import { RecipeListSkeleton } from '@/widgets/recipe-list';
import { FavoritesPage } from './FavoritesPage';

const MOCK_USER_ID = 'user-1';

/**
 * 성공 케이스용 QueryClient: 즐겨찾기 목록 + 프로필 캐시 세팅
 *
 * FavoritesPage는 RecipeList에 favoritesByUserId를 전달하므로
 * 해당 파라미터가 포함된 infinite 키로 캐시 세팅
 */
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  // useCurrentProfile (FavoritesPage + RecipeList 내부)
  queryClient.setQueryData(profileKeys.current(), mockProfile);

  // useSuspenseInfiniteRecipes 캐시 (RecipeList 내부)
  // favoritesByUserId가 포함된 키로 세팅
  queryClient.setQueryData(
    recipeKeys.infinite({ favoritesByUserId: MOCK_USER_ID }),
    {
      pages: [{ recipes: mockRecipes.slice(0, 4), hasMore: false }],
      pageParams: [0],
    },
  );

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
  title: 'views/favorites/FavoritesPage',
  component: FavoritesPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FavoritesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 즐겨찾기 목록 정상 표시
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
 * 빈 상태: 즐겨찾기한 레시피가 없을 때
 */
export const Empty: Story = {
  decorators: [
    Story => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: Infinity },
          mutations: { retry: false },
        },
      });

      queryClient.setQueryData(profileKeys.current(), mockProfile);

      queryClient.setQueryData(
        recipeKeys.infinite({ favoritesByUserId: MOCK_USER_ID }),
        {
          pages: [{ recipes: [], hasMore: false }],
          pageParams: [0],
        },
      );

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
 * 로딩 상태: 쿼리가 pending 상태 → 내부 Suspense fallback 표시
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/*', async () => {
          await delay('infinite');
        }),
      ],
    },
  },
  decorators: [
    Story => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      queryClient.setQueryData(profileKeys.current(), mockProfile);

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

/**
 * 에러 상태: QueryErrorFallback (Skeleton + ErrorBottomSheet) 표시
 */
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/*', () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
          );
        }),
      ],
    },
  },
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
