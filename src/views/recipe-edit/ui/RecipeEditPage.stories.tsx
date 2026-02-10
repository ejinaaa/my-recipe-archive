import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { mockCategoryGroups } from '@/entities/category/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { categoryKeys } from '@/entities/category/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { Skeleton } from '@/shared/ui/skeleton';
import { ErrorBottomSheet } from '@/shared/ui/error-bottom-sheet';
import { RecipeEditPage } from './RecipeEditPage';

const MOCK_RECIPE_ID = '1';

/**
 * 폼 스켈레톤 (Suspense fallback)
 */
function FormSkeleton() {
  return (
    <main className='px-4 pt-6 flex flex-col gap-6'>
      <div className='flex flex-col items-center gap-2'>
        <Skeleton className='size-24 rounded-full' />
        <Skeleton className='h-3 w-32' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-12 w-full rounded-xl' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-24 w-full rounded-xl' />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className='flex flex-col gap-3'>
          <Skeleton className='h-4 w-24' />
          <div className='flex flex-wrap gap-2'>
            {[1, 2, 3, 4, 5].map(j => (
              <Skeleton key={j} className='h-8 w-16 rounded-full' />
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

/**
 * 성공 케이스용 QueryClient: 레시피 + 카테고리 + 프로필 캐시 세팅
 */
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  // useSuspenseRecipe 캐시 (RecipeEditContent 내부)
  queryClient.setQueryData(
    recipeKeys.detail(MOCK_RECIPE_ID),
    mockRecipes[0],
  );

  // useSuspenseCategoryGroups 캐시 (RecipeEditContent 내부)
  queryClient.setQueryData(categoryKeys.groups(), mockCategoryGroups);

  // useCurrentProfile 캐시 (RecipeEditPage 셸)
  queryClient.setQueryData(profileKeys.current(), {
    id: 'user-1',
    nickname: '요리사',
  });

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
  queryClient.setQueryData(profileKeys.current(), {
    id: 'user-1',
    nickname: '요리사',
  });

  return queryClient;
}

const meta = {
  title: 'views/recipe-edit/RecipeEditPage',
  component: RecipeEditPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeEditPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 레시피 편집 폼 정상 표시
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
          <Suspense fallback={<FormSkeleton />}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * 에러 상태: ErrorFallback (레시피/카테고리 조회 실패) 표시
 */
export const Error: Story = {
  args: {
    id: MOCK_RECIPE_ID,
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
 * Mutation 에러: 레시피 수정 실패 시 ErrorBottomSheet 표시
 */
export const UpdateMutationError: Story = {
  args: {
    id: MOCK_RECIPE_ID,
  },
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
            title='레시피를 수정하지 못했어요'
            description='수정한 내용은 유지돼요. 다시 시도해주세요'
          />
        </QueryClientProvider>
      );
    },
  ],
};

/**
 * Mutation 에러: 레시피 삭제 실패 시 ErrorBottomSheet 표시
 */
export const DeleteMutationError: Story = {
  args: {
    id: MOCK_RECIPE_ID,
  },
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
            title='레시피를 삭제하지 못했어요'
            description='잠시 후 다시 시도해주세요'
          />
        </QueryClientProvider>
      );
    },
  ],
};
