import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCreateForm } from './RecipeCreateForm';
import type { CategoryGroup } from '@/entities/category/model/types';

/**
 * Mock 카테고리 그룹 데이터
 */
const mockCategoryGroups: CategoryGroup[] = [
  {
    type: 'situation',
    options: [
      { id: 1, type: 'situation', code: 'daily', name: '일상' },
      { id: 2, type: 'situation', code: 'speed', name: '초스피드' },
      { id: 3, type: 'situation', code: 'guest', name: '손님접대' },
      { id: 4, type: 'situation', code: 'solo', name: '혼밥' },
      { id: 5, type: 'situation', code: 'diet', name: '다이어트' },
      { id: 6, type: 'situation', code: 'bento', name: '도시락' },
    ],
  },
  {
    type: 'cuisine',
    options: [
      { id: 7, type: 'cuisine', code: 'korean', name: '한식' },
      { id: 8, type: 'cuisine', code: 'bunsik', name: '분식' },
      { id: 9, type: 'cuisine', code: 'western', name: '양식' },
      { id: 10, type: 'cuisine', code: 'chinese', name: '중식' },
      { id: 11, type: 'cuisine', code: 'japanese', name: '일식' },
      { id: 12, type: 'cuisine', code: 'asian', name: '동남아식' },
    ],
  },
  {
    type: 'dishType',
    options: [
      { id: 13, type: 'dishType', code: 'rice', name: '밥/죽' },
      { id: 14, type: 'dishType', code: 'noodle', name: '면요리' },
      { id: 15, type: 'dishType', code: 'soup', name: '국/탕' },
      { id: 16, type: 'dishType', code: 'stew', name: '찌개/전골' },
      { id: 17, type: 'dishType', code: 'salad', name: '샐러드/무침' },
      { id: 18, type: 'dishType', code: 'main_dish', name: '메인반찬' },
    ],
  },
];

/**
 * 레시피 생성 폼 컴포넌트
 */
const meta = {
  title: 'features/recipe-create/RecipeCreateForm',
  component: RecipeCreateForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSubmit: {
      action: 'submitted',
    },
  },
  decorators: [
    Story => (
      <div className="max-w-md mx-auto bg-white p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecipeCreateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 폼 상태
 */
export const Default: Story = {
  args: {
    categoryGroups: mockCategoryGroups,
    onSubmit: async data => {
      console.log('Submitted:', data);
    },
  },
};

/**
 * 카테고리 없이 표시
 */
export const WithoutCategories: Story = {
  args: {
    categoryGroups: [],
    onSubmit: async data => {
      console.log('Submitted:', data);
    },
  },
};

/**
 * 제출 중 상태 (시뮬레이션)
 */
export const Submitting: Story = {
  args: {
    categoryGroups: mockCategoryGroups,
    onSubmit: async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
    },
  },
};
