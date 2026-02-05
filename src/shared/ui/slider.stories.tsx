import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Slider } from './slider';

const meta = {
  title: 'shared/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    min: 0,
    max: 100,
    step: 1,
  },
  argTypes: {
    colorScheme: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    label: { control: 'text' },
    valueDisplay: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className='w-80 p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 슬라이더
 */
export const Default: Story = {
  args: {
    defaultValue: 50,
  },
};

/**
 * 라벨과 값 표시
 */
export const WithLabelAndValue: Story = {
  args: {
    label: '볼륨',
    valueDisplay: '75%',
    defaultValue: 75,
  },
};

/**
 * 범위 슬라이더 (두 개의 thumb)
 */
export const Range: Story = {
  args: {
    label: '가격 범위',
    valueDisplay: '20원 ~ 80원',
    defaultValue: [20, 80],
    min: 0,
    max: 100,
  },
};

/**
 * Secondary 색상 스킴
 */
export const SecondaryColorScheme: Story = {
  args: {
    colorScheme: 'secondary',
    label: '밝기',
    valueDisplay: '60%',
    defaultValue: 60,
  },
};

/**
 * 크기 비교
 */
export const Sizes: Story = {
  render: () => (
    <div className='space-y-8'>
      <Slider size='sm' label='Small' defaultValue={30} />
      <Slider size='md' label='Medium' defaultValue={50} />
      <Slider size='lg' label='Large' defaultValue={70} />
    </div>
  ),
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    label: '비활성화',
    valueDisplay: '50%',
    defaultValue: 50,
    disabled: true,
  },
};

/**
 * 커스텀 범위 (0-1000, step 10)
 */
export const CustomRange: Story = {
  args: {
    label: '예산',
    valueDisplay: '500만원',
    defaultValue: 500,
    min: 0,
    max: 1000,
    step: 10,
  },
};

/**
 * 제어 컴포넌트 예시
 */
export const Controlled: Story = {
  render: function ControlledSlider() {
    const [value, setValue] = useState(50);

    return (
      <div className='space-y-4'>
        <Slider
          label='제어 슬라이더'
          valueDisplay={`${value}%`}
          value={value}
          onValueChange={(v) => setValue(v as number)}
        />
        <p className='text-body-2 text-text-secondary'>현재 값: {value}</p>
      </div>
    );
  },
};

/**
 * 제어 범위 슬라이더 예시
 */
export const ControlledRange: Story = {
  render: function ControlledRangeSlider() {
    const [value, setValue] = useState([20, 80]);

    return (
      <div className='space-y-4'>
        <Slider
          label='가격 범위'
          valueDisplay={`${value[0]}만원 ~ ${value[1]}만원`}
          value={value}
          onValueChange={(v) => setValue(v as number[])}
          max={100}
        />
        <p className='text-body-2 text-text-secondary'>
          선택 범위: {value[0]}만원 - {value[1]}만원
        </p>
      </div>
    );
  },
};
