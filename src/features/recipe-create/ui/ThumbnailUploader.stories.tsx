import type { Meta, StoryObj } from '@storybook/react';
import { ThumbnailUploader } from './ThumbnailUploader';

const meta = {
  title: 'features/recipe-create/ThumbnailUploader',
  component: ThumbnailUploader,
  tags: ['autodocs'],
  args: {
    thumbnailUrl: '',
    isUploading: false,
    error: null,
    disabled: false,
    onFileSelect: () => {},
    onDelete: () => {},
  },
  argTypes: {
    isUploading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
} satisfies Meta<typeof ThumbnailUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithImage: Story = {
  args: {
    thumbnailUrl:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  },
};

export const Uploading: Story = {
  args: {
    isUploading: true,
  },
};

export const WithError: Story = {
  args: {
    error: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
  },
};
