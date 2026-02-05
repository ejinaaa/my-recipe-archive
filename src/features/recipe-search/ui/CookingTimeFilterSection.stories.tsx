import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CookingTimeFilterSection } from './CookingTimeFilterSection';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';

const meta = {
  title: 'features/recipe-search/CookingTimeFilterSection',
  component: CookingTimeFilterSection,
  tags: ['autodocs'],
  args: {
    value: [COOKING_TIME_MIN, COOKING_TIME_MAX] as [number, number],
    onChange: () => {},
  },
  decorators: [
    Story => (
      <div className='max-w-md p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CookingTimeFilterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태 - 전체 범위 선택
 */
export const Default: Story = {};

/**
 * 짧은 조리시간 선택
 */
export const ShortTime: Story = {
  args: {
    value: [5, 30],
  },
};

/**
 * 중간 조리시간 선택
 */
export const MediumTime: Story = {
  args: {
    value: [30, 120],
  },
};

/**
 * 긴 조리시간 선택
 */
export const LongTime: Story = {
  args: {
    value: [120, 300],
  },
};

/**
 * 인터랙티브 - 상태 변경 가능
 */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<[number, number]>(args.value);
    return <CookingTimeFilterSection value={value} onChange={setValue} />;
  },
};
