import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'Shared/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline'],
      description: '뱃지의 스타일 변형',
    },
    colorScheme: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral', 'surface'],
      description: '뱃지의 색상 테마',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '뱃지의 크기',
    },
    transparent: {
      control: 'boolean',
      description: '투명도 효과 적용 여부',
    },
    selected: {
      control: 'boolean',
      description: '선택 상태 여부 (검정 배경, 흰색 텍스트)',
    },
    closable: {
      control: 'boolean',
      description: 'close 버튼 표시 여부',
    },
    onClose: {
      action: 'closed',
      description:
        'close 버튼 클릭 시 호출되는 핸들러 (closable이 true일 때 필수)',
    },
    children: {
      control: 'text',
      description: '뱃지 내부 콘텐츠',
    },
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'outline',
    colorScheme: 'neutral',
    size: 'md',
    transparent: false,
    selected: false,
    children: 'Badge',
    closable: false,
  },
};
