import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBottomSheet } from './error-bottom-sheet';

const meta = {
  title: 'Shared/ErrorBottomSheet',
  component: ErrorBottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onRetry: () => {},
    onCancel: () => {},
  },
};

export const WithHomeButton: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onRetry: () => {},
    onHome: () => {},
    onCancel: () => {},
  },
};

export const RetryOnly: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onRetry: () => {},
  },
};

export const CustomMessages: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onRetry: () => {},
    onCancel: () => {},
    title: '레시피 목록을 가져오지 못했어요',
    description: '네트워크 상태를 확인하고 다시 시도해주세요',
  },
};
