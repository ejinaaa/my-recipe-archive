import type { Meta, StoryObj } from '@storybook/react';
import { RecipeDetailView } from './RecipeDetailView';
import { mockRecipes } from '@/entities/recipe/model/mock';

const meta: Meta<typeof RecipeDetailView> = {
  title: 'Views/RecipeDetail/RecipeDetailView',
  component: RecipeDetailView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof RecipeDetailView>;

// 바질 토마토 파스타 사용
const completeRecipe = mockRecipes[0];

// 최소 데이터만 있는 레시피 (실제 목록에서 가져옴)
const minimalRecipe = mockRecipes[14]; // 아보카도 토스트

export const Default: Story = {
  args: {
    recipe: completeRecipe,
    isFavorite: false,
  },
};

export const Favorite: Story = {
  args: {
    recipe: completeRecipe,
    isFavorite: true,
  },
};

export const MinimalData: Story = {
  args: {
    recipe: minimalRecipe,
    isFavorite: false,
  },
};

export const WithoutThumbnail: Story = {
  args: {
    recipe: {
      ...completeRecipe,
      thumbnail_url: undefined,
    },
    isFavorite: false,
  },
};

export const LongRecipe: Story = {
  args: {
    recipe: {
      ...mockRecipes[2], // 볼로네제 파스타 사용
      steps: [
        ...mockRecipes[2].steps,
        {
          step: 8,
          description: '추가 단계: 더 많은 내용을 테스트하기 위한 단계입니다.',
        },
        {
          step: 9,
          description:
            '스크롤 테스트를 위한 추가 단계입니다. 화면을 스크롤하면 썸네일 영역이 점점 작아지는 것을 확인할 수 있습니다.',
        },
        {
          step: 10,
          description:
            '마지막 단계입니다. 충분히 스크롤하면 썸네일이 완전히 가려지고 back 버튼과 favorite 버튼만 보이게 됩니다.',
        },
      ],
      ingredients: [
        ...mockRecipes[2].ingredients,
        { name: '바질', amount: '한 줌' },
        { name: '파슬리', amount: '약간' },
        { name: '화이트 와인', amount: '50', unit: 'ml' },
      ],
    },
    isFavorite: false,
  },
};
