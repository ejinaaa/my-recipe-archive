import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'Shared/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled'],
      description: 'Textarea 스타일 변형',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Textarea 크기',
    },
    colorScheme: {
      control: 'select',
      options: ['neutral'],
      description: '색상 테마',
    },
    placeholder: {
      control: 'text',
      description: '입력 힌트 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: '보이는 줄 수',
    },
    // UI 렌더링과 무관한 속성 제외
    className: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    placeholder: '내용을 입력하세요...',
    disabled: false,
  },
};
