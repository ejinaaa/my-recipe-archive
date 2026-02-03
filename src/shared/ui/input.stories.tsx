import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta = {
  title: 'Shared/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled'],
      description: 'Input의 스타일 variant',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Input의 크기',
    },
    colorScheme: {
      control: 'select',
      options: ['neutral'],
      description: 'Input의 색상 테마',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input 타입',
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: 'Input 비활성화 상태',
    },
    // UI와 무관한 Props 제외
    className: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    type: 'text',
    placeholder: 'Enter text...',
  },
};
