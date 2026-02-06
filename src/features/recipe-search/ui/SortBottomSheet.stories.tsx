import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SortBottomSheet } from './SortBottomSheet';
import { Button } from '@/shared/ui/button';
import type { RecipeSortBy } from '@/entities/recipe/api/server';

const meta = {
  title: 'features/recipe-search/SortBottomSheet',
  component: SortBottomSheet,
  tags: ['autodocs'],
  args: {
    open: false,
    onOpenChange: () => {},
    initialSortBy: 'latest',
    onApply: () => {},
  },
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
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState<RecipeSortBy>('latest');

    const handleApply = (newSortBy: RecipeSortBy) => {
      setSortBy(newSortBy);
      setOpen(false);
    };

    return (
      <div className='p-4'>
        <div className='mb-4'>
          <p className='text-body-2 text-text-secondary'>현재 정렬: {sortBy}</p>
        </div>
        <Button onClick={() => setOpen(true)}>정렬 열기</Button>
        <SortBottomSheet
          open={open}
          onOpenChange={setOpen}
          initialSortBy={sortBy}
          onApply={handleApply}
        />
      </div>
    );
  },
};

/**
 * 바텀시트가 열린 상태
 */
export const Open: Story = {
  args: {
    open: true,
    initialSortBy: 'popular',
  },
};
