import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';
import { Button } from './button';
import { Toaster } from './sonner';

const meta = {
  title: 'Shared/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="solid"
          colorScheme="primary"
          onClick={() => toast.success('저장되었어요')}
        >
          Success
        </Button>
        <Button
          size="sm"
          variant="solid"
          colorScheme="neutral"
          onClick={() => toast.error('요청을 처리하지 못했어요')}
        >
          Error
        </Button>
        <Button
          size="sm"
          variant="outline"
          colorScheme="neutral"
          onClick={() => toast.warning('변경 사항이 저장되지 않았어요')}
        >
          Warning
        </Button>
        <Button
          size="sm"
          variant="outline"
          colorScheme="neutral"
          onClick={() => toast.info('새로운 레시피가 추가되었어요')}
        >
          Info
        </Button>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="neutral"
          onClick={() => toast.loading('저장하는 중...')}
        >
          Loading
        </Button>
      </div>
    </>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="solid"
          colorScheme="primary"
          onClick={() =>
            toast.success('레시피가 저장되었어요', {
              description: '마이페이지에서 확인할 수 있어요',
            })
          }
        >
          Success + 설명
        </Button>
        <Button
          size="sm"
          variant="solid"
          colorScheme="neutral"
          onClick={() =>
            toast.error('즐겨찾기에 추가하지 못했어요', {
              description: '잠시 후 다시 시도해주세요',
            })
          }
        >
          Error + 설명
        </Button>
      </div>
    </>
  ),
};

export const AutoDismiss: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          colorScheme="neutral"
          onClick={() =>
            toast.error('권한이 없어 처리하지 못했어요', {
              duration: 3000,
            })
          }
        >
          3초 후 자동 사라짐
        </Button>
        <Button
          size="sm"
          variant="outline"
          colorScheme="neutral"
          onClick={() =>
            toast.success('삭제되었어요', {
              duration: 1500,
            })
          }
        >
          1.5초 후 자동 사라짐
        </Button>
      </div>
    </>
  ),
};
