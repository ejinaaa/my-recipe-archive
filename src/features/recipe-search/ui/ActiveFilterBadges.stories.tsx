import type { Meta, StoryObj } from '@storybook/react';
import { ActiveFilterBadges } from './ActiveFilterBadges';

const meta = {
  title: 'features/recipe-search/ActiveFilterBadges',
  component: ActiveFilterBadges,
  tags: ['autodocs'],
  args: {
    sortBy: null,
    categoryFilters: { situation: [], cuisine: [], dishType: [] },
    cookingTimeRange: null,

    onRemoveSort: () => {},
    onRemoveCategoryFilter: () => {},
    onRemoveCookingTime: () => {},
  },
  decorators: [
    Story => (
      <div className='max-w-md bg-background'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActiveFilterBadges>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 필터 없음 - 아무것도 렌더링하지 않음 */
export const NoFilters: Story = {};

/** 정렬만 적용 */
export const SortOnly: Story = {
  args: {
    sortBy: 'most_cooked',

  },
};

/** 카테고리 필터만 적용 */
export const CategoryOnly: Story = {
  args: {
    categoryFilters: {
      situation: ['daily'],
      cuisine: [],
      dishType: [],
    },

  },
};

/** 조리시간만 적용 */
export const CookingTimeOnly: Story = {
  args: {
    cookingTimeRange: { min: 10, max: 60 },

  },
};

/** 모든 필터 적용 - 필터 먼저, 정렬 나중 (스크롤 테스트) */
export const AllFilters: Story = {
  args: {
    sortBy: 'favorites',
    categoryFilters: {
      situation: ['daily'],
      cuisine: ['korean'],
      dishType: ['rice'],
    },
    cookingTimeRange: { min: 15, max: 90 },

  },
};
