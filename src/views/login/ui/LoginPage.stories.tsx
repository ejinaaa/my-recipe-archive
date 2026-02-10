import type { Meta, StoryObj } from '@storybook/react';
import { LoginPage } from './LoginPage';

const meta = {
  title: 'views/login/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태: 카카오 로그인 페이지
 */
export const Default: Story = {};
