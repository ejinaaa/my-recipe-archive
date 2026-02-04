import type { Meta, StoryObj } from '@storybook/react';
import { BackButton } from './back-button';

const meta: Meta<typeof BackButton> = {
  title: 'Shared/BackButton',
  component: BackButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
  args: {},
};

export const WithHandler: Story = {
  args: {
    onBack: () => alert('뒤로 가기'),
  },
};
