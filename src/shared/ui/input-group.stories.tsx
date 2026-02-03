import type { Meta, StoryObj } from '@storybook/react';
import { Search, Mail, Send } from 'lucide-react';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupText,
} from './input-group';

const meta = {
  title: 'Shared/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled'],
      description: 'Input group variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input group size',
    },
    colorScheme: {
      control: 'select',
      options: ['neutral'],
      description: 'Color scheme',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    role: { control: false },
    className: { control: false },
  },
  decorators: [
    Story => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    disabled: false,
  },
  render: args => (
    <InputGroup {...args}>
      <InputGroupInput placeholder='Enter text...' />
    </InputGroup>
  ),
};

export const WithIconStart: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    disabled: false,
  },
  render: args => (
    <InputGroup {...args}>
      <InputGroupAddon align='inline-start'>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder='Search...' />
    </InputGroup>
  ),
};

export const WithIconEnd: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    disabled: false,
  },
  render: args => (
    <InputGroup {...args}>
      <InputGroupInput type='email' placeholder='Email address' />
      <InputGroupAddon align='inline-end'>
        <Mail />
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithIconAndText: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    disabled: false,
  },
  render: args => (
    <InputGroup {...args}>
      <InputGroupAddon align='inline-start'>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder='Search...' />
      <InputGroupAddon align='inline-end'>
        <InputGroupText>⌘K</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    disabled: false,
  },
  render: args => (
    <InputGroup {...args}>
      <InputGroupInput placeholder='Enter message...' />
      <InputGroupAddon align='inline-end'>
        <InputGroupButton>
          <Send />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithTextarea: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    colorScheme: 'neutral',
    disabled: false,
  },
  render: args => (
    <InputGroup {...args}>
      <InputGroupTextarea placeholder='Enter your message...' rows={4} />
      <InputGroupAddon align='block-end'>
        <InputGroupButton>Send</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};
