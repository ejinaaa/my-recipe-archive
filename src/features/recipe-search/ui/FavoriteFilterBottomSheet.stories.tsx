import type { Meta, StoryObj } from '@storybook/react';
import { FavoriteFilterBottomSheet } from './FavoriteFilterBottomSheet';
import { useFilterStore } from '../model/store';
import { Button } from '@/shared/ui/button';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta = {
  title: 'features/recipe-search/FavoriteFilterBottomSheet',
  component: FavoriteFilterBottomSheet,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <div className='min-h-screen'>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof FavoriteFilterBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 바텀시트 열기 버튼과 함께 표시
 */
export const Default: Story = {
  render: function Render() {
    const openBottomSheet = useFilterStore(state => state.openBottomSheet);

    return (
      <div className='p-4'>
        <Button onClick={openBottomSheet}>필터 열기</Button>
        <FavoriteFilterBottomSheet />
      </div>
    );
  },
};

/**
 * 바텀시트가 열린 상태
 */
export const Open: Story = {
  render: function Render() {
    const openBottomSheet = useFilterStore(state => state.openBottomSheet);

    // 스토리 로드 시 자동으로 열기
    setTimeout(() => openBottomSheet(), 100);

    return (
      <div className='p-4'>
        <Button onClick={openBottomSheet}>필터 열기</Button>
        <FavoriteFilterBottomSheet />
      </div>
    );
  },
};
