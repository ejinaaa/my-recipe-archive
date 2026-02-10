import type { Meta, StoryObj } from '@storybook/react';
import { CategoryChip } from './CategoryChip';
import type { CategoryOption } from '../model/types';

const mockCategory: CategoryOption = {
  id: 1,
  type: 'cuisine',
  code: 'korean',
  name: '한식',
  image_url:
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=200&h=200&fit=crop',
};

const mockCategoryNoImage: CategoryOption = {
  id: 2,
  type: 'situation',
  code: 'daily',
  name: '일상',
};

const meta = {
  title: 'entities/category/CategoryChip',
  component: CategoryChip,
  tags: ['autodocs'],
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof CategoryChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 이미지가 있는 카테고리 칩
 */
export const Default: Story = {
  args: {
    category: mockCategory,
  },
};

/**
 * 이미지 없음: CookingPot 아이콘 fallback 표시
 */
export const NoImage: Story = {
  args: {
    category: mockCategoryNoImage,
  },
};
