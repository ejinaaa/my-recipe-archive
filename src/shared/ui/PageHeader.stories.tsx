import type { Meta, StoryObj } from '@storybook/react';
import { ChevronLeft, Search } from 'lucide-react';
import { PageHeader } from './page-header';
import { Button } from './button';

const meta = {
  title: 'shared/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story) => (
      <div className='bg-neutral-100 min-h-[200px]'>
        <Story />
        <div className='px-4 py-8 text-body-2 text-text-secondary'>
          페이지 콘텐츠 영역
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 사용 - 중앙 정렬 타이틀 */
export const CenteredTitle: Story = {
  args: {
    children: (
      <h1 className='text-heading-2 text-text-primary text-center'>
        페이지 제목
      </h1>
    ),
  },
};

/** 좌우 배치 (justify-between) */
export const BetweenLayout: Story = {
  args: {
    children: (
      <div className='flex items-center justify-between'>
        <h1 className='text-heading-3 text-text-primary'>안녕, 요리사님</h1>
        <Button
          variant='solid'
          colorScheme='primary'
          size='sm'
          transparent
          className='size-10 p-0'
        >
          <Search className='size-5' />
        </Button>
      </div>
    ),
  },
};

/** 뒤로가기 + 중앙 타이틀 */
export const WithBackButton: Story = {
  args: {
    children: (
      <div className='relative flex items-center justify-center'>
        <Button
          variant='solid'
          colorScheme='neutral'
          size='sm'
          className='absolute left-0 size-10 p-0'
        >
          <ChevronLeft className='size-5' />
        </Button>
        <h1 className='text-heading-2 text-text-primary'>레시피 수정</h1>
      </div>
    ),
  },
};

/** className 커스텀 */
export const CustomClassName: Story = {
  args: {
    className: 'pb-6',
    children: (
      <h1 className='text-heading-2 text-text-primary'>검색</h1>
    ),
  },
};
