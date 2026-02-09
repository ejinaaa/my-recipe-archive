import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecipeSection } from './RecipeSection';
import { RecipeSectionSkeleton } from './RecipeSectionSkeleton';
import { mockRecipes } from '@/entities/recipe/model/mock';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const meta = {
  title: 'widgets/recipe-section/RecipeSection',
  component: RecipeSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <div className='py-4'>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: '섹션 제목',
    },
    moreHref: {
      control: 'text',
      description: '"전체 보기" 링크 경로',
    },
    onRecipeClick: {
      action: 'recipe clicked',
      description: '레시피 카드 클릭 콜백',
    },
  },
  args: {
    title: '자주 만드는 요리들이에요',
    recipes: mockRecipes.slice(0, 6),
    moreHref: '/search/results?sort=most_cooked',
    onRecipeClick: () => {},
  },
} satisfies Meta<typeof RecipeSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 섹션 */
export const Default: Story = {};

/** "전체 보기" 링크 없는 경우 */
export const WithoutMoreLink: Story = {
  args: {
    title: '이런 요리도 만들어봐요',
    moreHref: undefined,
  },
};

/** 레시피가 적은 경우 */
export const FewRecipes: Story = {
  args: {
    title: '새로 추가한 요리에요',
    recipes: mockRecipes.slice(0, 2),
    moreHref: '/search/results?sort=latest',
  },
};

/** 로딩 스켈레톤 */
export const Loading: Story = {
  render: () => <RecipeSectionSkeleton />,
};
