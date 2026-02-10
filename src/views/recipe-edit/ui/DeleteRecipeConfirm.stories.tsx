import type { Meta, StoryObj } from '@storybook/react';
import { DeleteRecipeConfirm } from './DeleteRecipeConfirm';

const meta = {
  title: 'views/recipe-edit/DeleteRecipeConfirm',
  component: DeleteRecipeConfirm,
  tags: ['autodocs'],
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => {},
    isPending: false,
  },
} satisfies Meta<typeof DeleteRecipeConfirm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 삭제 확인 Bottom Sheet
 */
export const Default: Story = {};

/**
 * 삭제 진행 중: 버튼 비활성화 + 로딩 텍스트
 */
export const Pending: Story = {
  args: {
    isPending: true,
  },
};
