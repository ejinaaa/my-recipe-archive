import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { mockCategoryGroups } from '@/entities/category/model/mock';
import { categoryKeys } from '@/entities/category/api/keys';
import { SearchPageSkeleton } from './SearchPageSkeleton';
import { SearchPage } from './SearchPage';

/**
 * 성공 케이스용 QueryClient: 카테고리 그룹 캐시 세팅
 */
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  // useSuspenseCategoryGroups 캐시 (SearchContent 내부)
  queryClient.setQueryData(categoryKeys.groups(), mockCategoryGroups);

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
  title: 'views/search/SearchPage',
  component: SearchPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 카테고리 섹션 정상 표시
 */
export const Default: Story = {
  decorators: [
    Story => {
      const queryClient = createSuccessQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<SearchPageSkeleton />}>
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
