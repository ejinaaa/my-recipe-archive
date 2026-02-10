import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockCategoryGroups } from '@/entities/category/model/mock';
import { categoryKeys } from '@/entities/category/api/keys';
import { FilterBottomSheet } from './FilterBottomSheet';

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

  queryClient.setQueryData(categoryKeys.groups(), mockCategoryGroups);

  return queryClient;
}

/**
 * 에러 케이스용 QueryClient: 캐시 비어 있음 + retry 꺼짐
 * fetch 실패 → ErrorBoundary → CategorySectionsError 표시
 */
function createErrorQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

/**
 * open 상태를 제어하는 래퍼 (Controlled Component)
 */
function FilterBottomSheetWrapper({
  createQueryClient,
}: {
  createQueryClient: () => QueryClient;
}) {
  const [open, setOpen] = useState(true);
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <button
        onClick={() => setOpen(true)}
        className='px-4 py-2 bg-primary-base text-white rounded-lg'
      >
        필터 열기
      </button>
      <FilterBottomSheet
        open={open}
        onOpenChange={setOpen}
        onApply={() => setOpen(false)}
      />
    </QueryClientProvider>
  );
}

const meta = {
  title: 'features/recipe-search/FilterBottomSheet',
  component: FilterBottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    open: true,
    onOpenChange: () => {},
    onApply: () => {},
  },
} satisfies Meta<typeof FilterBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 카테고리 필터 정상 표시
 */
export const Default: Story = {
  render: () => (
    <FilterBottomSheetWrapper createQueryClient={createSuccessQueryClient} />
  ),
};

/**
 * 에러 상태: CategorySectionsError (inline 에러 UI) 표시
 */
export const Error: Story = {
  render: () => (
    <FilterBottomSheetWrapper createQueryClient={createErrorQueryClient} />
  ),
};
