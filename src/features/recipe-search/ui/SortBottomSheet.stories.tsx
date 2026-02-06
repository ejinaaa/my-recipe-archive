import type { Meta, StoryObj } from '@storybook/react';
import { SortBottomSheet } from './SortBottomSheet';
import { useSortStore } from '../model/sortStore';
import { Button } from '@/shared/ui/button';

const meta = {
  title: 'features/recipe-search/SortBottomSheet',
  component: SortBottomSheet,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='min-h-screen'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SortBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 바텀시트 열기 버튼과 함께 표시
 */
export const Default: Story = {
  render: function Render() {
    const openBottomSheet = useSortStore(state => state.openBottomSheet);

    return (
      <div className='p-4'>
        <Button onClick={openBottomSheet}>정렬 열기</Button>
        <SortBottomSheet />
      </div>
    );
  },
};

/**
 * 바텀시트가 열린 상태
 */
export const Open: Story = {
  render: function Render() {
    const openBottomSheet = useSortStore(state => state.openBottomSheet);

    // 스토리 로드 시 자동으로 열기
    setTimeout(() => openBottomSheet(), 100);

    return (
      <div className='p-4'>
        <Button onClick={openBottomSheet}>정렬 열기</Button>
        <SortBottomSheet />
      </div>
    );
  },
};
