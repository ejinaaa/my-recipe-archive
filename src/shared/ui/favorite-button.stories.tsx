import type { Meta, StoryObj } from '@storybook/react';
import { FavoriteButton } from './favorite-button';

const meta: Meta<typeof FavoriteButton> = {
  title: 'Shared/FavoriteButton',
  component: FavoriteButton,
  tags: ['autodocs'],
  argTypes: {
    isFavorite: {
      control: 'boolean',
      description: '즐겨찾기 상태',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '버튼 크기',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FavoriteButton>;

export const Default: Story = {
  args: {
    isFavorite: false,
  },
};

export const Favorited: Story = {
  args: {
    isFavorite: true,
  },
};

export const Small: Story = {
  args: {
    isFavorite: false,
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    isFavorite: false,
    size: 'md',
  },
};

export const Interactive: Story = {
  render: () => {
    const [isFavorite, setIsFavorite] = React.useState(false);

    return (
      <div className='flex gap-4'>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => setIsFavorite(!isFavorite)}
        />
        <span>
          {isFavorite ? '즐겨찾기에 추가됨' : '즐겨찾기에 추가되지 않음'}
        </span>
      </div>
    );
  },
};

import * as React from 'react';
