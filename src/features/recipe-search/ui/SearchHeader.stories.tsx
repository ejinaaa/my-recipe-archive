import type { Meta, StoryObj } from '@storybook/react';
import { SearchHeader } from './SearchHeader';

const meta = {
  title: 'Features/recipe-search/SearchHeader',
  component: SearchHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    searchQuery: {
      control: 'text',
      description: '검색어 (controlled mode)',
    },
    onSearchChange: {
      action: 'search changed',
      description: '검색어 변경 이벤트',
    },
    onBackClick: {
      action: 'back clicked',
      description: '뒤로가기 클릭 이벤트 (없으면 BackButton 숨김)',
    },
    onSortClick: {
      action: 'sort clicked',
      description: '정렬 버튼 클릭 이벤트',
    },
    onFilterClick: {
      action: 'filter clicked',
      description: '필터 버튼 클릭 이벤트',
    },
  },
} satisfies Meta<typeof SearchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchQuery: '',
  },
};

export const WithoutBackButton: Story = {
  args: {
    searchQuery: '',
    onBackClick: undefined,
  },
  argTypes: {
    onBackClick: {
      table: { disable: true },
    },
  },
};
