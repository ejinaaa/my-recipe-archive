import { describe, it, expect } from 'vitest';
import type { CategoryFilters } from './types';
import { toggleCategoryFilter } from './utils';

const emptyFilters: CategoryFilters = {
  situation: [],
  cuisine: [],
  dishType: [],
};

describe('toggleCategoryFilter', () => {
  it('새 코드를 추가한다', () => {
    const result = toggleCategoryFilter(emptyFilters, 'situation', 'daily');

    expect(result.situation).toEqual(['daily']);
  });

  it('이미 있는 코드를 제거한다', () => {
    const filters: CategoryFilters = {
      ...emptyFilters,
      situation: ['daily', 'speed'],
    };
    const result = toggleCategoryFilter(filters, 'situation', 'daily');

    expect(result.situation).toEqual(['speed']);
  });

  it('다른 타입의 필터에 영향을 주지 않는다', () => {
    const filters: CategoryFilters = {
      situation: ['daily'],
      cuisine: ['korean'],
      dishType: ['rice'],
    };
    const result = toggleCategoryFilter(filters, 'cuisine', 'western');

    expect(result.situation).toEqual(['daily']);
    expect(result.cuisine).toEqual(['korean', 'western']);
    expect(result.dishType).toEqual(['rice']);
  });

  it('마지막 코드를 제거하면 빈 배열이 된다', () => {
    const filters: CategoryFilters = {
      ...emptyFilters,
      cuisine: ['korean'],
    };
    const result = toggleCategoryFilter(filters, 'cuisine', 'korean');

    expect(result.cuisine).toEqual([]);
  });

  it('원본 객체를 변경하지 않는다 (불변성)', () => {
    const filters: CategoryFilters = {
      ...emptyFilters,
      situation: ['daily'],
    };
    const result = toggleCategoryFilter(filters, 'situation', 'speed');

    expect(filters.situation).toEqual(['daily']);
    expect(result.situation).toEqual(['daily', 'speed']);
    expect(result).not.toBe(filters);
  });
});
