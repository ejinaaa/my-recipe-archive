import type { Meta, StoryObj } from '@storybook/react';
import { ErrorFallback } from './error-fallback';

const meta = {
  title: 'Shared/ErrorFallback',
  component: ErrorFallback,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onBack: () => {},
    onRetry: () => {},
  },
};

export const WithoutBackButton: Story = {
  args: {
    onRetry: () => {},
  },
};

export const WithoutRetryButton: Story = {
  args: {
    onBack: () => {},
  },
};

export const CustomMessages: Story = {
  args: {
    title: '레시피를 불러올 수 없어요',
    description: '네트워크 상태를 확인하고 다시 시도해주세요',
    onBack: () => {},
    onRetry: () => {},
  },
};
