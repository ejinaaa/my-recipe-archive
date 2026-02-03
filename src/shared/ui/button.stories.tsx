import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight, Plus, Heart } from 'lucide-react';
import { Button } from './button';

const meta = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
      description: '버튼의 시각적 스타일',
    },
    colorScheme: {
      control: 'select',
      options: ['primary', 'secondary', 'neutral'],
      description: '버튼의 컬러 테마',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼의 크기',
    },
    transparent: {
      control: 'boolean',
      description: '반투명 배경 적용 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    children: {
      control: 'text',
      description: '버튼 내부 텍스트',
    },
    asChild: {
      control: false,
      description: 'Radix Slot 사용 (고급 기능)',
    },
    onClick: {
      action: 'clicked',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'solid',
    colorScheme: 'primary',
    size: 'md',
    transparent: false,
    disabled: false,
    children: 'Button',
  },
};

export const WithIconLeft: Story = {
  args: {
    variant: 'solid',
    colorScheme: 'primary',
    size: 'md',
    transparent: false,
    disabled: false,
    children: (
      <>
        <Plus />
        Add Item
      </>
    ),
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'outline',
    colorScheme: 'primary',
    size: 'md',
    transparent: false,
    disabled: false,
    children: (
      <>
        Continue
        <ChevronRight />
      </>
    ),
  },
};

export const WithIconBoth: Story = {
  args: {
    variant: 'solid',
    colorScheme: 'secondary',
    size: 'md',
    transparent: false,
    disabled: false,
    children: (
      <>
        <ChevronRight />
        Navigate
        <ChevronRight />
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'ghost',
    colorScheme: 'primary',
    size: 'md',
    transparent: false,
    disabled: false,
    children: <Heart />,
  },
};
