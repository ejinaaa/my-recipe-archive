import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCard } from './RecipeCard';
import { mockRecipes } from '../model/mock';

const meta: Meta<typeof RecipeCard> = {
  title: 'Entities/recipe/RecipeCard',
  component: RecipeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
      description: 'Recipe data to display',
    },
    isFavorite: {
      control: 'boolean',
      description: 'Whether the recipe is favorited',
    },
    onToggleFavorite: {
      action: 'favorite toggled',
      description: 'Callback when favorite button is clicked',
    },
    className: {
      control: false,
    },
  },
  args: {
    recipe: mockRecipes[0],
    isFavorite: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default recipe card with all features
 */
export const Default: Story = {
  args: {
    isFavorite: false,
  },
};

/**
 * Recipe without thumbnail
 */
export const NoThumbnail: Story = {
  args: {
    recipe: {
      ...mockRecipes[0],
      thumbnail_url: undefined,
    },
  },
};

/**
 * Recipe without description
 */
export const NoDescription: Story = {
  args: {
    recipe: mockRecipes[4], // Pasta Alfredo - no description
  },
};

/**
 * Recipe with minimal info (no cooking time)
 */
export const MinimalInfo: Story = {
  args: {
    recipe: mockRecipes[8], // Caesar Salad - no cooking time
  },
};

/**
 * Grid layout example
 */
export const GridLayout: Story = {
  render: args => (
    <div className='grid grid-cols-2 gap-4 p-4 max-w-4xl'>
      {mockRecipes.slice(0, 6).map(recipe => (
        <RecipeCard key={recipe.id} {...args} recipe={recipe} />
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
