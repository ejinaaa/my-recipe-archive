import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight, Home, ExternalLink } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { LinkButton } from './link-button';

const meta = {
  title: 'Shared/LinkButton',
  component: LinkButton,
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
    href: {
      control: 'text',
      description: '이동할 경로',
    },
    children: {
      control: 'text',
      description: '버튼 내부 텍스트',
    },
  },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'solid',
    colorScheme: 'primary',
    size: 'md',
    transparent: false,
    href: ROUTES.RECIPES.LIST,
    children: 'Go to Recipes',
  },
};

export const WithIconLeft: Story = {
  args: {
    variant: 'solid',
    colorScheme: 'primary',
    size: 'md',
    href: ROUTES.HOME,
    children: (
      <>
        <Home />
        Home
      </>
    ),
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'outline',
    colorScheme: 'primary',
    size: 'md',
    href: ROUTES.RECIPES.LIST,
    children: (
      <>
        View More
        <ChevronRight />
      </>
    ),
  },
};

export const ExternalLinkExample: Story = {
  args: {
    variant: 'ghost',
    colorScheme: 'neutral',
    size: 'sm',
    href: 'https://example.com',
    target: '_blank',
    children: (
      <>
        External Link
        <ExternalLink />
      </>
    ),
  },
};
