import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';
import { QueryErrorFallback } from './query-error-fallback';

/**
 * 레시피 목록 스켈레톤 (스토리용)
 */
function RecipeListSkeleton() {
  return (
    <div className='pb-4'>
      <div className='grid grid-cols-2 gap-2 px-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='aspect-[3/4] rounded-2xl' />
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Shared/QueryErrorFallback',
  component: QueryErrorFallback,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QueryErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSkeleton: Story = {
  args: {
    skeleton: <RecipeListSkeleton />,
    onRetry: () => {},
    onCancel: () => {},
    title: '레시피 목록을 가져오지 못했어요',
    description: '네트워크 상태를 확인하고 다시 시도해주세요',
  },
};

export const WithHomeButton: Story = {
  args: {
    skeleton: <RecipeListSkeleton />,
    onRetry: () => {},
    onCancel: () => {},
    onHome: () => {},
    title: '검색 결과를 가져오지 못했어요',
    description: '네트워크 상태를 확인하고 다시 시도해주세요',
  },
};

export const CustomMessages: Story = {
  args: {
    skeleton: <RecipeListSkeleton />,
    onRetry: () => {},
    onCancel: () => {},
    title: '즐겨찾기 목록을 가져오지 못했어요',
    description: '네트워크 상태를 확인하고 다시 시도해주세요',
  },
};
