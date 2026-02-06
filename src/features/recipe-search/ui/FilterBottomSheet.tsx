'use client';

import { useState, useEffect } from 'react';
import { useCategoryGroups } from '@/entities/category/api/hooks';
import type { CategoryType } from '@/entities/category/model/types';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/shared/ui/drawer';
import type { CategoryFilters, CookingTimeRange } from '../model/store';
import { toggleCategoryFilter, initialFilters, initialCookingTimeRange } from '../model/store';
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

interface FilterBottomSheetProps {
  /** 바텀시트 열림 상태 */
  open: boolean;
  /** 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
  /** 초기 카테고리 필터값 */
  initialFilters?: CategoryFilters;
  /** 초기 조리시간 범위 */
  initialCookingTime?: CookingTimeRange;
  /** 필터 적용 핸들러 */
  onApply: (filters: CategoryFilters, cookingTime: CookingTimeRange) => void;
  /** 조건 없이 보기 핸들러 (즐겨찾기 페이지용) */
  onApplyEmpty?: () => void;
  /** 필터 필수 여부 (검색 결과: true, 즐겨찾기: false) */
  requireFilter?: boolean;
}

/**
 * 필터 바텀시트 (순수 UI 컴포넌트)
 *
 * SearchFilterBottomSheet와 FavoriteFilterBottomSheet를 통합한 컴포넌트.
 * URL/store 로직 없이 props만으로 동작.
 */
export function FilterBottomSheet({
  open,
  onOpenChange,
  initialFilters: propInitialFilters = initialFilters,
  initialCookingTime: propInitialCookingTime = initialCookingTimeRange,
  onApply,
  onApplyEmpty,
  requireFilter = true,
}: FilterBottomSheetProps) {
  // 카테고리 데이터 조회
  const {
    data: categoryGroups,
    isLoading,
    isError,
    refetch,
  } = useCategoryGroups();

  // 로컬 임시 상태 (바텀시트 내 편집용)
  const [tempFilters, setTempFilters] = useState<CategoryFilters>(propInitialFilters);
  const [tempCookingTime, setTempCookingTime] = useState<[number, number]>([
    propInitialCookingTime.min,
    propInitialCookingTime.max,
  ]);

  // 바텀시트 열릴 때 초기값으로 리셋
  useEffect(() => {
    if (open) {
      setTempFilters(propInitialFilters);
      setTempCookingTime([propInitialCookingTime.min, propInitialCookingTime.max]);
    }
  }, [open, propInitialFilters, propInitialCookingTime]);

  // 카테고리 그룹을 정렬된 순서로 변환
  const sortedGroups = CATEGORY_TYPE_ORDER.map(type => {
    const group = categoryGroups?.find(g => g.type === type);
    return {
      type,
      options: group?.options ?? [],
    };
  });

  const handleToggleCategory = (type: CategoryType, code: string) => {
    setTempFilters(prev => toggleCategoryFilter(prev, type, code));
  };

  const handleClearAll = () => {
    setTempFilters(initialFilters);
    setTempCookingTime([COOKING_TIME_MIN, COOKING_TIME_MAX]);
  };

  // 필터가 하나라도 변경되었는지 확인
  const hasAnyFilter =
    tempFilters.situation.length > 0 ||
    tempFilters.cuisine.length > 0 ||
    tempFilters.dishType.length > 0 ||
    tempCookingTime[0] !== initialCookingTimeRange.min ||
    tempCookingTime[1] !== initialCookingTimeRange.max;

  const handleApply = () => {
    const newCookingTimeRange: CookingTimeRange = {
      min: tempCookingTime[0],
      max: tempCookingTime[1],
    };
    onApply(tempFilters, newCookingTimeRange);
    onOpenChange(false);
  };

  const handleApplyEmpty = () => {
    onApplyEmpty?.();
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader className='flex flex-col items-center'>
          <DrawerTitle>어떤 요리를 찾으세요?</DrawerTitle>
          <Button
            variant='ghost'
            size='sm'
            colorScheme='primary'
            onClick={handleClearAll}
            className='self-end text-body-2 text-primary-base mt-2'
          >
            모두 지우기
          </Button>
        </DrawerHeader>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-4 pb-10 space-y-6'>
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
        <DrawerFooter className={onApplyEmpty ? 'flex flex-row gap-2' : ''}>
          <Button
            variant='solid'
            colorScheme='primary'
            size='lg'
            className={onApplyEmpty ? 'flex-1' : 'w-full'}
            onClick={handleApply}
            disabled={requireFilter && !hasAnyFilter}
          >
            요리 보러가기
          </Button>
          {onApplyEmpty && (
            <Button
              variant='solid'
              colorScheme='secondary'
              size='lg'
              onClick={handleApplyEmpty}
            >
              조건 없이 보기
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
