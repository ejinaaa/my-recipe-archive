import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, delay, HttpResponse } from 'msw';
import { Suspense } from 'react';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { mockCategoryGroups } from '@/entities/category/model/mock';
import { mockProfile } from '@/entities/user/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { categoryKeys } from '@/entities/category/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { HomePage } from './HomePage';

/**
 * 모든 섹션 데이터가 채워진 QueryClient
 */
function createFullQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  // 프로필
  queryClient.setQueryData(profileKeys.current(), mockProfile);

  // 오늘의 추천 (random)
  queryClient.setQueryData(recipeKeys.random(), mockRecipes[0]);

  // 많이 해본 요리 (most_cooked)
  queryClient.setQueryData(
    recipeKeys.section('most_cooked'),
    mockRecipes.slice(0, 6),
  );

  // 더 도전해볼 요리 (least_cooked)
  queryClient.setQueryData(
    recipeKeys.section('least_cooked'),
    mockRecipes.slice(6, 12),
  );

  // 최근 추가한 레시피 (latest)
  queryClient.setQueryData(
    recipeKeys.section('latest'),
    mockRecipes.slice(3, 9),
  );

  // 카테고리
  queryClient.setQueryData(categoryKeys.groups(), mockCategoryGroups);

  // 전체 레시피 (infinite)
  queryClient.setQueryData(recipeKeys.infinite({}), {
    pages: [{ recipes: mockRecipes.slice(0, 6), hasMore: false }],
    pageParams: [0],
  });

  return queryClient;
}

/**
 * 섹션 데이터가 비어있는 QueryClient (빈 배열)
 */
function createEmptyQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  queryClient.setQueryData(profileKeys.current(), mockProfile);

  queryClient.setQueryData(recipeKeys.random(), null);
  queryClient.setQueryData(recipeKeys.section('most_cooked'), []);
  queryClient.setQueryData(recipeKeys.section('least_cooked'), []);
  queryClient.setQueryData(recipeKeys.section('latest'), []);
  queryClient.setQueryData(categoryKeys.groups(), mockCategoryGroups);
  queryClient.setQueryData(recipeKeys.infinite({}), {
    pages: [{ recipes: [], hasMore: false }],
    pageParams: [0],
  });

  return queryClient;
}

/**
 * 에러 케이스용 QueryClient
 */
function createErrorQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  // 프로필만 캐시에 넣어줌
  queryClient.setQueryData(profileKeys.current(), mockProfile);

  return queryClient;
}

const meta = {
  title: 'views/home/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 모든 섹션 데이터 정상 표시
 */
export const Default: Story = {
  decorators: [
    Story => {
      const queryClient = createFullQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense>
            <Story />
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 빈 상태: 모든 섹션 데이터가 비어있음 (신규 유저)
 */
export const Empty: Story = {
  decorators: [
    Story => {
      const queryClient = createEmptyQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense>
            <Story />
          </Suspense>
        </QueryClientProvider>
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
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 에러 상태: 섹션 데이터 조회 실패
 * SilentErrorBoundary로 에러 섹션이 숨겨짐
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
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};
