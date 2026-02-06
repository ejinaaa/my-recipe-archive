import type { Meta, StoryObj } from '@storybook/react';
import { CategoryCard } from './CategoryCard';
import type { CategoryOption } from '../model/types';

const meta = {
  title: 'entities/category/CategoryCard',
  component: CategoryCard,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-40'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const situationCategory: CategoryOption = {
  id: 1,
  type: 'situation',
  code: 'daily',
  name: '일상',
  icon: '🍳',
};

const cuisineCategory: CategoryOption = {
  id: 2,
  type: 'cuisine',
  code: 'korean',
  name: '한식',
  icon: '🍚',
};

const dishTypeCategory: CategoryOption = {
  id: 3,
  type: 'dishType',
  code: 'noodle',
  name: '면요리',
  icon: '🍜',
};

const categoryWithImage: CategoryOption = {
  id: 4,
  type: 'situation',
  code: 'solo',
  name: '혼밥',
  icon: '🥢',
  image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
};

export const Situation: Story = {
  args: {
    category: situationCategory,
  },
};

export const Cuisine: Story = {
  args: {
    category: cuisineCategory,
  },
};

export const DishType: Story = {
  args: {
    category: dishTypeCategory,
  },
};

export const WithImage: Story = {
  args: {
    category: categoryWithImage,
  },
};

export const Grid: Story = {
  decorators: [
    Story => (
      <div className='grid grid-cols-2 gap-3 w-80'>
        <Story />
        <CategoryCard category={cuisineCategory} />
        <CategoryCard category={dishTypeCategory} />
        <CategoryCard category={categoryWithImage} />
      </div>
    ),
  ],
  args: {
    category: situationCategory,
  },
};
