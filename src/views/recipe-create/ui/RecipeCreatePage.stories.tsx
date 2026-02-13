import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { http, delay, HttpResponse } from 'msw';
import { mockCategoryGroups } from '@/entities/category/model/mock';
import { categoryKeys } from '@/entities/category/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { mockProfile } from '@/entities/user/model/mock';
import { Skeleton } from '@/shared/ui/skeleton';
import { ErrorBottomSheet } from '@/shared/ui/error-bottom-sheet';
import { RecipeCreatePage } from './RecipeCreatePage';

/**
 * 폼 스켈레톤 (Suspense fallback)
 */
function FormSkeleton() {
  return (
    <div className='px-5 pt-6 space-y-6'>
      <Skeleton className='h-10 w-full rounded-lg' />
      <Skeleton className='h-24 w-full rounded-lg' />
      <Skeleton className='h-10 w-full rounded-lg' />
      <Skeleton className='h-10 w-full rounded-lg' />
      <div className='space-y-3'>
        <Skeleton className='h-5 w-24 rounded-md' />
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-16 rounded-full' />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 성공 케이스용 QueryClient: 카테고리 + 프로필 캐시 세팅
 */
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  // useSuspenseCategoryGroupsQuery 캐시 (RecipeCreateContent 내부)
  queryClient.setQueryData(categoryKeys.groups(), mockCategoryGroups);

  // useCurrentProfile 캐시 (RecipeCreatePage 셸)
  queryClient.setQueryData(profileKeys.current(), mockProfile);

  return queryClient;
}

/**
 * 에러 케이스용 QueryClient: 캐시 비어 있음 + retry 꺼짐
 * fetch 실패 → ErrorBoundary → ErrorFallback 표시
 */
function createErrorQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  // 프로필은 캐시에 넣어줌 (useQuery이므로 에러 시에도 페이지 렌더링에 영향 없음)
  queryClient.setQueryData(profileKeys.current(), mockProfile);

  return queryClient;
}

const meta = {
  title: 'views/recipe-create/RecipeCreatePage',
  component: RecipeCreatePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeCreatePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 레시피 작성 폼 정상 표시
 */
export const Default: Story = {
  decorators: [
    Story => {
      const queryClient = createSuccessQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<FormSkeleton />}>
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
 * 에러 상태: ErrorFallback (카테고리 조회 실패) 표시
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

/**
 * Mutation 에러: 레시피 저장 실패 시 ErrorBottomSheet 표시
 */
export const CreateMutationError: Story = {
  decorators: [
    Story => {
      const queryClient = createSuccessQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<FormSkeleton />}>
            <Story />
          </Suspense>
          <ErrorBottomSheet
            open
            onOpenChange={() => {}}
            onRetry={() => {}}
            onCancel={() => {}}
            title='레시피를 저장하지 못했어요'
            description='작성한 내용은 유지돼요. 다시 시도해주세요'
          />
        </QueryClientProvider>
      );
    },
  ],
};
