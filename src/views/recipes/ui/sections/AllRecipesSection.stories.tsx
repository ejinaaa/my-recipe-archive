import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { RecipeListSkeleton } from '@/widgets/recipe-list';
import { AllRecipesSection } from './AllRecipesSection';

/**
 * 성공 케이스용 QueryClient: 캐시에 mock 데이터 세팅
 */
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  // useSuspenseInfiniteRecipes 캐시 (AllRecipesSection → RecipeList)
  // RecipeList가 props 없이 호출되면 params는 { searchQuery: undefined, ... } 객체가 됨
  // React Query hashKey는 undefined 값을 제거하므로 빈 객체와 동일하게 해시됨
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
  title: 'views/recipes/AllRecipesSection',
  component: AllRecipesSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AllRecipesSection>;

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
 * 에러 상태: QueryErrorFallback (Skeleton + ErrorBottomSheet) 표시
 */
export const Error: Story = {
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
