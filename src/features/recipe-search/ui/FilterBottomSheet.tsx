'use client';

import { useState, useEffect, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import type { CategoryType } from '@/entities/category/model/types';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
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
}

/**
 * 카테고리 섹션 스켈레톤 (Suspense fallback)
 */
function CategorySectionsSkeleton() {
  return (
    <>
      {CATEGORY_TYPE_ORDER.map(type => (
        <section key={type} className='space-y-3'>
          <h3 className='text-heading-3 text-text-primary'>
            {CATEGORY_TYPE_LABELS[type]}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-8 w-16 rounded-full' />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

/**
 * 카테고리 섹션 에러 (ErrorBoundary fallback)
 */
function CategorySectionsError({
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className='flex flex-col items-center gap-3 rounded-lg bg-neutral-base p-6'>
      <p className='text-body-2 text-text-secondary'>
        카테고리를 불러오지 못했어요
      </p>
      <Button
        variant='outline'
        colorScheme='neutral'
        size='sm'
        onClick={resetErrorBoundary}
      >
        다시 시도
      </Button>
    </div>
  );
}

/**
 * 카테고리 필터 섹션 (Suspense Query 사용)
 */
function CategorySections({
  tempFilters,
  onToggle,
}: {
  tempFilters: CategoryFilters;
  onToggle: (type: CategoryType, code: string) => void;
}) {
  const { data: categoryGroups } = useSuspenseCategoryGroups();

  const sortedGroups = CATEGORY_TYPE_ORDER.map(type => {
    const group = categoryGroups.find(g => g.type === type);
    return {
      type,
      options: group?.options ?? [],
    };
  });

  return (
    <>
      {sortedGroups.map(({ type, options }) => (
        <CategoryFilterSection
          key={type}
          type={type}
          options={options}
          selectedCodes={tempFilters[type]}
          onToggle={code => onToggle(type, code)}
        />
      ))}
    </>
  );
}

/**
 * 필터 바텀시트 (순수 UI 컴포넌트)
 *
 * 카테고리 + 조리시간 필터를 설정하는 바텀시트.
 * URL/store 로직 없이 props만으로 동작.
 */
export function FilterBottomSheet({
  open,
  onOpenChange,
  initialFilters: propInitialFilters = initialFilters,
  initialCookingTime: propInitialCookingTime = initialCookingTimeRange,
  onApply,
}: FilterBottomSheetProps) {
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

  const handleToggleCategory = (type: CategoryType, code: string) => {
    setTempFilters(prev => toggleCategoryFilter(prev, type, code));
  };

  const handleClearAll = () => {
    setTempFilters(initialFilters);
    setTempCookingTime([COOKING_TIME_MIN, COOKING_TIME_MAX]);
  };

  const handleApply = () => {
    const newCookingTimeRange: CookingTimeRange = {
      min: tempCookingTime[0],
      max: tempCookingTime[1],
    };
    onApply(tempFilters, newCookingTimeRange);
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
          {/* 카테고리 섹션 (Suspense + ErrorBoundary) */}
          <ErrorBoundary FallbackComponent={CategorySectionsError}>
            <Suspense fallback={<CategorySectionsSkeleton />}>
              <CategorySections
                tempFilters={tempFilters}
                onToggle={handleToggleCategory}
              />
            </Suspense>
          </ErrorBoundary>

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
            onClick={handleApply}
          >
            요리 보러가기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
