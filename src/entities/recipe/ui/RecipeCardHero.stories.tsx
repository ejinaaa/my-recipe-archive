import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCardHero } from './RecipeCardHero';
import { mockRecipes } from '../model/mock';

const meta = {
  title: 'entities/recipe/RecipeCardHero',
  component: RecipeCardHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div className='w-[360px]'>
        <Story />
      </div>
    ),
  ],
  args: {
    recipe: mockRecipes[0],
  },
} satisfies Meta<typeof RecipeCardHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 Hero 카드 */
export const Default: Story = {};

/** 설명 없는 경우 */
export const NoDescription: Story = {
  args: {
    recipe: mockRecipes[4],
  },
};

/** 썸네일 없는 경우 */
export const NoThumbnail: Story = {
  args: {
    recipe: {
      ...mockRecipes[0],
      thumbnail_url: undefined,
    },
  },
};

/** 조리시간 없는 경우 */
export const NoCookingTime: Story = {
  args: {
    recipe: mockRecipes[8],
  },
};

/** 긴 제목 */
export const LongTitle: Story = {
  args: {
    recipe: {
      ...mockRecipes[0],
      title: '아주 길고 긴 레시피 제목이 들어가는 경우에 잘리는지 확인하는 테스트',
    },
  },
};
