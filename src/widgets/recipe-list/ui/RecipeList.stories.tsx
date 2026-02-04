import type { Meta, StoryObj } from '@storybook/react';
import { RecipeList } from './RecipeList';
import { mockRecipes } from '@/entities/recipe/model/mock';

const meta = {
  title: 'Widgets/recipe-list/RecipeList',
  component: RecipeList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태 - 전체 레시피 목록 표시
 */
export const Default: Story = {
  args: {
    recipes: mockRecipes,
    searchQuery: '',
  },
};

/**
 * 검색 결과 없음 - Empty State 표시
 */
export const EmptyState: Story = {
  args: {
    recipes: mockRecipes,
    searchQuery: '존재하지않는레시피xyz',
  },
};

/**
 * 적은 개수 - 무한 스크롤 없이 모두 표시
 */
export const FewItems: Story = {
  args: {
    recipes: mockRecipes.slice(0, 3),
    searchQuery: '',
  },
};
