import { Suspense } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';
import { RecipeCarousel } from './RecipeCarousel';
import { RecipeCarouselSkeleton } from './RecipeCarouselSkeleton';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { recipeKeys } from '@/entities/recipe/api/keys';
import { profileKeys } from '@/entities/user/api/keys';
import { mockProfile } from '@/entities/user/model/mock';
import { ROUTES } from '@/shared/config';

function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(
    recipeKeys.section('most_cooked'),
    mockRecipes.slice(0, 6),
  );
  queryClient.setQueryData(profileKeys.current(), mockProfile);
  return queryClient;
}

const meta = {
  title: 'widgets/recipe-section/RecipeCarousel',
  component: RecipeCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => {
      const queryClient = createSuccessQueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense>
            <div className='py-4'>
              <Story />
            </div>
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
  argTypes: {
    title: {
      control: 'text',
      description: '섹션 제목',
    },
    sortBy: {
      control: 'select',
      options: ['most_cooked', 'least_cooked', 'latest', 'most_viewed'],
      description: '정렬 기준',
    },
    limit: {
      control: 'number',
      description: '조회할 레시피 수',
    },
    moreHref: {
      control: 'text',
      description: '"전체 보기" 링크 경로',
    },
  },
  args: {
    title: '자주 만드는 요리들이에요',
    sortBy: 'most_cooked',
    moreHref: `${ROUTES.SEARCH_RESULTS}?sort=most_cooked`,
  },
} satisfies Meta<typeof RecipeCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 섹션 */
export const Default: Story = {};

/** "전체 보기" 링크 없는 경우 */
export const WithoutMoreLink: Story = {
  args: {
    title: '이런 요리도 만들어봐요',
    sortBy: 'least_cooked',
    moreHref: undefined,
  },
  decorators: [
    Story => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        recipeKeys.section('least_cooked'),
        mockRecipes.slice(0, 6),
      );
      queryClient.setQueryData(profileKeys.current(), mockProfile);
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense>
            <div className='py-4'>
              <Story />
            </div>
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/** 레시피가 적은 경우 */
export const FewRecipes: Story = {
  args: {
    title: '새로 추가한 요리에요',
    sortBy: 'latest',
    moreHref: `${ROUTES.SEARCH_RESULTS}?sort=latest`,
  },
  decorators: [
    Story => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: Infinity },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(
        recipeKeys.section('latest'),
        mockRecipes.slice(0, 2),
      );
      queryClient.setQueryData(profileKeys.current(), mockProfile);
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense>
            <div className='py-4'>
              <Story />
            </div>
          </Suspense>
        </QueryClientProvider>
      );
    },
  ],
};

/** 로딩 스켈레톤 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/*', async () => {
          await delay('infinite');
        }),
      ],
    },
  },
  decorators: [
    Story => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(profileKeys.current(), mockProfile);
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  render: () => <RecipeCarouselSkeleton title='자주 만드는 요리들이에요' />,
};

/** 에러 상태 */
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/*', () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
          );
        }),
      ],
    },
  },
  decorators: [
    Story => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });
      queryClient.setQueryData(profileKeys.current(), mockProfile);
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};
