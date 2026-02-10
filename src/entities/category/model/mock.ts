import type { CategoryGroup } from './types';

/**
 * 스토리북/테스트용 카테고리 그룹 mock 데이터
 */
export const mockCategoryGroups: CategoryGroup[] = [
  {
    type: 'situation',
    options: [
      { id: 1, type: 'situation', code: 'daily', name: '일상', sort_order: 1 },
      { id: 2, type: 'situation', code: 'speed', name: '초스피드', sort_order: 2 },
      { id: 3, type: 'situation', code: 'guest', name: '손님접대', sort_order: 3 },
      { id: 4, type: 'situation', code: 'solo', name: '혼밥', sort_order: 4 },
      { id: 5, type: 'situation', code: 'diet', name: '다이어트', sort_order: 5 },
      { id: 6, type: 'situation', code: 'bento', name: '도시락', sort_order: 6 },
    ],
  },
  {
    type: 'cuisine',
    options: [
      { id: 10, type: 'cuisine', code: 'korean', name: '한식', sort_order: 1 },
      { id: 11, type: 'cuisine', code: 'western', name: '양식', sort_order: 2 },
      { id: 12, type: 'cuisine', code: 'japanese', name: '일식', sort_order: 3 },
      { id: 13, type: 'cuisine', code: 'chinese', name: '중식', sort_order: 4 },
      { id: 14, type: 'cuisine', code: 'asian', name: '동남아식', sort_order: 5 },
    ],
  },
  {
    type: 'dishType',
    options: [
      { id: 20, type: 'dishType', code: 'rice', name: '밥/죽', sort_order: 1 },
      { id: 21, type: 'dishType', code: 'noodle', name: '면요리', sort_order: 2 },
      { id: 22, type: 'dishType', code: 'soup', name: '국/탕', sort_order: 3 },
      { id: 23, type: 'dishType', code: 'stew', name: '찌개/전골', sort_order: 4 },
      { id: 24, type: 'dishType', code: 'salad', name: '샐러드/무침', sort_order: 5 },
      { id: 25, type: 'dishType', code: 'main_dish', name: '메인반찬', sort_order: 6 },
    ],
  },
];
