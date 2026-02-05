'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { useCategoryGroups } from '@/entities/category/api/hooks';
import type { CategoryType } from '@/entities/category/model/types';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import {
  useFilterStore,
  toggleCategoryFilter,
  initialFilters,
  initialCookingTimeRange,
  type CategoryFilters,
  type CookingTimeRange,
} from '../model/store';
import { CategoryFilterSection } from './CategoryFilterSection';
import { CookingTimeFilterSection } from './CookingTimeFilterSection';

/**
 * 카테고리 타입 정렬 순서
 */
const CATEGORY_TYPE_ORDER: CategoryType[] = [
  'situation',
  'cuisine',
  'dishType',
];

export function FilterBottomSheet() {
  const {
    isOpen,
    categoryFilters,
    cookingTimeRange,
    closeBottomSheet,
    applyFilters,
  } = useFilterStore();

  // 로컬 상태 (바텀시트 내 편집용)
  const [tempFilters, setTempFilters] =
    useState<CategoryFilters>(categoryFilters);
  const [tempCookingTime, setTempCookingTime] = useState<[number, number]>([
    cookingTimeRange.min,
    cookingTimeRange.max,
  ]);

  // 카테고리 데이터 조회
  const {
    data: categoryGroups,
    isLoading,
    isError,
    refetch,
  } = useCategoryGroups();

  // 바텀시트 열릴 때 전역 상태를 로컬로 복사
  useEffect(() => {
    if (isOpen) {
      setTempFilters(categoryFilters);
      setTempCookingTime([cookingTimeRange.min, cookingTimeRange.max]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleToggleCategory = (type: CategoryType, code: string) => {
    setTempFilters(prev => toggleCategoryFilter(prev, type, code));
  };

  const handleSearch = () => {
    const newCookingTimeRange: CookingTimeRange = {
      min: tempCookingTime[0],
      max: tempCookingTime[1],
    };
    applyFilters(tempFilters, newCookingTimeRange);
  };

  const handleClearAll = () => {
    setTempFilters(initialFilters);
    setTempCookingTime([COOKING_TIME_MIN, COOKING_TIME_MAX]);
  };

  // 카테고리 그룹을 정렬된 순서로 변환
  const sortedGroups = CATEGORY_TYPE_ORDER.map(type => {
    const group = categoryGroups?.find(g => g.type === type);
    return {
      type,
      options: group?.options ?? [],
    };
  });

  // 필터가 하나라도 변경되었는지 확인
  const hasAnyFilter =
    tempFilters.situation.length > 0 ||
    tempFilters.cuisine.length > 0 ||
    tempFilters.dishType.length > 0 ||
    tempCookingTime[0] !== initialCookingTimeRange.min ||
    tempCookingTime[1] !== initialCookingTimeRange.max;

  return (
    <Drawer open={isOpen} onOpenChange={open => !open && closeBottomSheet()}>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader className='relative flex items-center justify-center'>
          <DrawerTitle>어떤 요리를 찾으세요?</DrawerTitle>
          <button
            type='button'
            onClick={handleClearAll}
            className='absolute right-4 text-body-2 text-primary-base'
          >
            모두 지우기
          </button>
        </DrawerHeader>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-4 pt-4 pb-10 space-y-6'>
          {sortedGroups.map(({ type, options }) => (
            <CategoryFilterSection
              key={type}
              type={type}
              options={options}
              selectedCodes={tempFilters[type]}
              onToggle={code => handleToggleCategory(type, code)}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
            />
          ))}

          {/* 조리시간 섹션 */}
          <CookingTimeFilterSection
            value={tempCookingTime}
            onChange={setTempCookingTime}
          />
        </div>

        {/* Footer */}
        <DrawerFooter>
          <Button
            variant='solid'
            colorScheme='primary'
            size='lg'
            className='w-full'
            onClick={handleSearch}
            disabled={!hasAnyFilter}
          >
            요리 보러가기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
