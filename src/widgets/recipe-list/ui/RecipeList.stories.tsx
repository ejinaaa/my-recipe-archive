import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, delay, HttpResponse } from 'msw';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { mockProfile } from '@/entities/user/model/mock';
import { QueryErrorFallback } from '@/shared/ui/query-error-fallback';
import { RecipeListSkeleton } from './RecipeListSkeleton';
import { RecipeList } from './RecipeList';

/**
 * 성공 케이스용 QueryClient
 */
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  queryClient.setQueryData(recipeKeys.infinite({}), {
    pages: [{ recipes: mockRecipes.slice(0, 6), hasMore: false }],
    pageParams: [0],
  });

  queryClient.setQueryData(profileKeys.current(), mockProfile);

  return queryClient;
}

/**
 * 빈 상태용 QueryClient
 */
function createEmptyQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  queryClient.setQueryData(recipeKeys.infinite({}), {
    pages: [{ recipes: [], hasMore: false }],
    pageParams: [0],
  });

  queryClient.setQueryData(profileKeys.current(), mockProfile);

  return queryClient;
}

/**
 * 에러 케이스용 QueryClient
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
  title: 'widgets/recipe-list/RecipeList',
  component: RecipeList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 레시피 목록 정상 표시
 */
export const Default: Story = {
  decorators: [
    Story => {
      const queryClient = createSuccessQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<RecipeListSkeleton />}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 빈 상태: 레시피가 없을 때 empty UI 표시
 */
export const Empty: Story = {
  decorators: [
    Story => {
      const queryClient = createEmptyQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<RecipeListSkeleton />}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 로딩 상태: infinite query pending → Suspense fallback 표시
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
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<RecipeListSkeleton />}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 에러 상태: infinite query 조회 실패
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
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary
            fallbackRender={({ resetErrorBoundary }) => (
              <QueryErrorFallback
                skeleton={<RecipeListSkeleton />}
                onRetry={resetErrorBoundary}
                onHome={() => {}}
                title='레시피 목록을 가져오지 못했어요'
                description='네트워크 상태를 확인하고 다시 시도해주세요'
              />
            )}
          >
            <Suspense fallback={<RecipeListSkeleton />}>
              <Story />
            </Suspense>
          </ErrorBoundary>
        </QueryClientProvider>
      );
    },
  ],
};
