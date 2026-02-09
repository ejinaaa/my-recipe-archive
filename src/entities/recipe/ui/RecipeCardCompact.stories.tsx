import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCardCompact } from './RecipeCardCompact';
import { mockRecipes } from '../model/mock';

const meta = {
  title: 'entities/recipe/RecipeCardCompact',
  component: RecipeCardCompact,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    recipe: {
      control: 'select',
      options: mockRecipes.map(r => r.id),
      mapping: mockRecipes.reduce(
        (acc, recipe) => {
          acc[recipe.id] = recipe;
          return acc;
        },
        {} as Record<string, (typeof mockRecipes)[0]>,
      ),
      description: '레시피 데이터',
    },
    isFavorite: {
      control: 'boolean',
      description: '즐겨찾기 여부',
    },
    onToggleFavorite: {
      action: 'favorite toggled',
      description: '즐겨찾기 토글 콜백',
    },
    onClick: {
      action: 'card clicked',
      description: '카드 클릭 콜백',
    },
    className: {
      control: false,
    },
  },
  args: {
    recipe: mockRecipes[0],
    isFavorite: false,
  },
} satisfies Meta<typeof RecipeCardCompact>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 컴팩트 카드 */
export const Default: Story = {};

/** 즐겨찾기된 상태 */
export const Favorited: Story = {
  args: {
    isFavorite: true,
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
    recipe: mockRecipes[8], // 시저 샐러드 - cooking_time 없음
  },
};

/** 긴 제목 */
export const LongTitle: Story = {
  args: {
    recipe: {
      ...mockRecipes[0],
      title: '아주 길고 긴 레시피 제목이 들어가는 경우 잘리는지 확인',
    },
  },
};

/** 수평 스크롤 레이아웃 */
export const HorizontalScroll: Story = {
  render: args => (
    <div className='overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-sm'>
      <div className='flex gap-3'>
        {mockRecipes.slice(0, 6).map(recipe => (
          <RecipeCardCompact key={recipe.id} {...args} recipe={recipe} />
        ))}
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className='p-4'>
        <Story />
      </div>
    ),
  ],
};
