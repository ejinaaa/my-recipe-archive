import { describe, it, expect } from 'vitest';
import type { CategoryOption } from './types';
import { groupCategoriesByType } from './utils';

describe('groupCategoriesByType', () => {
  it('빈 배열은 빈 결과를 반환한다', () => {
    const result = groupCategoriesByType([]);

    expect(result).toEqual([]);
  });

  it('같은 타입의 옵션을 하나의 그룹으로 합친다', () => {
    const options: CategoryOption[] = [
      { id: 1, type: 'situation', code: 'daily', name: '일상', sort_order: 1 },
      { id: 2, type: 'situation', code: 'speed', name: '초스피드', sort_order: 2 },
      { id: 3, type: 'cuisine', code: 'korean', name: '한식', sort_order: 1 },
    ];
    const result = groupCategoriesByType(options);

    expect(result).toHaveLength(2);

    const situationGroup = result.find(g => g.type === 'situation');
    expect(situationGroup?.options).toHaveLength(2);

    const cuisineGroup = result.find(g => g.type === 'cuisine');
    expect(cuisineGroup?.options).toHaveLength(1);
  });

  it('sort_order 순으로 정렬한다', () => {
    const options: CategoryOption[] = [
      { id: 1, type: 'situation', code: 'speed', name: '초스피드', sort_order: 3 },
      { id: 2, type: 'situation', code: 'daily', name: '일상', sort_order: 1 },
      { id: 3, type: 'situation', code: 'guest', name: '손님접대', sort_order: 2 },
    ];
    const result = groupCategoriesByType(options);
    const group = result[0];

    expect(group.options[0].code).toBe('daily');
    expect(group.options[1].code).toBe('guest');
    expect(group.options[2].code).toBe('speed');
  });

  it('sort_order가 없으면 맨 뒤로 배치한다', () => {
    const options: CategoryOption[] = [
      { id: 1, type: 'cuisine', code: 'korean', name: '한식', sort_order: 1 },
      { id: 2, type: 'cuisine', code: 'etc', name: '기타' },
      { id: 3, type: 'cuisine', code: 'western', name: '양식', sort_order: 2 },
    ];
    const result = groupCategoriesByType(options);
    const group = result[0];

    expect(group.options[0].code).toBe('korean');
    expect(group.options[1].code).toBe('western');
    expect(group.options[2].code).toBe('etc');
  });
});
