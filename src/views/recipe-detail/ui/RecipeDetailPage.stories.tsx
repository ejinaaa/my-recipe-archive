import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { http, delay, HttpResponse } from 'msw';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { mockProfile } from '@/entities/user/model/mock';
import { cookingLogKeys } from '@/entities/cooking-log/api/keys';
import { Skeleton } from '@/shared/ui/skeleton';
import { QueryErrorFallback } from '@/shared/ui/query-error-fallback';
import { RecipeDetailPage } from './RecipeDetailPage';

const MOCK_RECIPE_ID = '1';
const MOCK_USER_ID = 'user-1';

/**
 * 상세 페이지 스켈레톤 (Suspense fallback)
 */
function DetailSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <Skeleton className='w-full h-[350px] rounded-b-3xl' />
      <div className='px-4 pt-6 space-y-4'>
        <div className='flex gap-1.5'>
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-28 rounded-full' />
        </div>
        <Skeleton className='h-7 w-48' />
        <Skeleton className='h-5 w-full' />
        <Skeleton className='h-5 w-3/4' />
      </div>
    </div>
  );
}

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

  queryClient.setQueryData(
    recipeKeys.detail(MOCK_RECIPE_ID),
    mockRecipes[0],
  );

  queryClient.setQueryData(profileKeys.current(), mockProfile);

  queryClient.setQueryData(
    cookingLogKeys.count(MOCK_USER_ID, MOCK_RECIPE_ID),
    3,
  );

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
  title: 'views/recipe-detail/RecipeDetailPage',
  component: RecipeDetailPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 레시피 상세 정보 정상 표시
 */
export const Default: Story = {
  args: {
    id: MOCK_RECIPE_ID,
  },
  decorators: [
    Story => {
      const queryClient = createSuccessQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<DetailSkeleton />}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 로딩 상태: 쿼리가 pending 상태 → Suspense fallback 표시
 */
export const Loading: Story = {
  args: {
    id: MOCK_RECIPE_ID,
  },
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
          <Suspense fallback={<DetailSkeleton />}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 에러 상태: 데이터 조회 실패
 */
export const Error: Story = {
  args: {
    id: MOCK_RECIPE_ID,
  },
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
                skeleton={<DetailSkeleton />}
                onRetry={resetErrorBoundary}
                onHome={() => {}}
                title='레시피를 불러오지 못했어요'
                description='네트워크 상태를 확인하고 다시 시도해주세요'
              />
            )}
          >
            <Suspense fallback={<DetailSkeleton />}>
              <Story />
            </Suspense>
          </ErrorBoundary>
        </QueryClientProvider>
      );
    },
  ],
};
