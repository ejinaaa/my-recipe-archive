import type { Meta, StoryObj } from '@storybook/react';
import { BottomNavigation } from './BottomNavigation';

const meta = {
  title: 'Widgets/bottom-navigation/BottomNavigation',
  component: BottomNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['home', 'search', 'favorites', 'register'],
      description: '현재 활성화된 탭',
    },
  },
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeTab: 'search',
  },
};
