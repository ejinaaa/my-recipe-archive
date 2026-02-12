'use client';

import { useState, useEffect, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseCategoryGroupsQuery } from '@/entities/category/api/hooks';
import type { CategoryType } from '@/entities/category/model/types';
import { getOptionsByType } from '@/entities/category/model/utils';
import { CATEGORY_TYPES, CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
} from '@/entities/recipe/model/constants';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/shared/ui/drawer';
import type { CategoryFilters, CookingTimeRange } from '../model/types';
import { toggleCategoryFilter } from '../model/utils';
import { initialFilters, initialCookingTimeRange } from '../model/constants';
import { CategoryFilterSection } from './CategoryFilterSection';
import { CookingTimeFilterSection } from './CookingTimeFilterSection';


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
      {CATEGORY_TYPES.map(type => (
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
 * 필터 에러 UI (ErrorBoundary fallback)
 * title을 제외한 전체 영역을 ErrorBottomSheet 스타일로 대체
 */
function FilterErrorContent({
  resetErrorBoundary,
  onClose,
}: {
  error: Error;
  resetErrorBoundary: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className='flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10'>
        <AlertCircle className='size-10 text-text-secondary mb-2' />
        <p className='text-heading-3 text-text-primary'>
          카테고리 정보를 가져오지 못했어요
        </p>
        <DrawerDescription className='text-body-2 text-text-secondary'>
          네트워크 상태를 확인하고 다시 시도해주세요
        </DrawerDescription>
      </div>
      <DrawerFooter>
        <Button
          variant='solid'
          colorScheme='primary'
          size='lg'
          onClick={resetErrorBoundary}
          className='w-full'
        >
          다시 시도
        </Button>
        <Button
          variant='solid'
          colorScheme='neutral'
          size='lg'
          onClick={onClose}
          className='w-full'
        >
          닫기
        </Button>
      </DrawerFooter>
    </>
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
  const { data: categoryGroups } = useSuspenseCategoryGroupsQuery();

  const sortedGroups = CATEGORY_TYPES.map(type => ({
    type,
    options: getOptionsByType(categoryGroups, type),
  }));

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
        {/* Header (title만 에러 시에도 유지) */}
        <DrawerHeader className='flex flex-col items-center'>
          <DrawerTitle>어떤 요리를 찾으세요?</DrawerTitle>
        </DrawerHeader>

        {/* Content + Footer (에러 시 전체 대체) */}
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <FilterErrorContent
              error={error}
              resetErrorBoundary={resetErrorBoundary}
              onClose={() => onOpenChange(false)}
            />
          )}
        >
          <div className='flex items-end px-4'>
            <Button
              variant='ghost'
              size='sm'
              colorScheme='primary'
              onClick={handleClearAll}
              className='ml-auto text-body-2 text-primary-base'
            >
              모두 지우기
            </Button>
          </div>
          <div className='flex-1 overflow-y-auto px-4 pb-10 space-y-6'>
            <Suspense fallback={<CategorySectionsSkeleton />}>
              <CategorySections
                tempFilters={tempFilters}
                onToggle={handleToggleCategory}
              />
            </Suspense>

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
        </ErrorBoundary>
      </DrawerContent>
    </Drawer>
  );
}
