import type { Meta, StoryObj } from '@storybook/react';
import { CategorySectionSkeleton } from './CategorySectionSkeleton';

/**
 * CategorySection은 내부에서 useSuspenseCategoryGroupsQuery() 훅으로
 * 데이터를 조회하므로 스토리에서는 스켈레톤 상태만 표시합니다.
 * 실제 컴포넌트는 개발 서버에서 확인하세요.
 */
const meta = {
  title: 'widgets/category-section/CategorySection',
  component: CategorySectionSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className='py-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CategorySectionSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 로딩 스켈레톤 */
export const Loading: Story = {};
