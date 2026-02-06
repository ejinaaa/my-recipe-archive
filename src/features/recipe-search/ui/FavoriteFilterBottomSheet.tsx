'use client';

import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { useFilterBottomSheet } from '../model/hooks';
import { CategoryFilterSection } from './CategoryFilterSection';
import { CookingTimeFilterSection } from './CookingTimeFilterSection';

/**
 * 즐겨찾기 페이지용 필터 바텀시트
 * 필터 없이도 적용 가능 (전체 보기)
 */
export function FavoriteFilterBottomSheet() {
  const {
    isOpen,
    closeBottomSheet,
    sortedGroups,
    isLoading,
    isError,
    refetch,
    tempFilters,
    tempCookingTime,
    setTempCookingTime,
    handleToggleCategory,
    handleClearAll,
    hasAnyFilter,
    handleApply,
    handleApplyEmpty,
  } = useFilterBottomSheet();

  return (
    <Drawer open={isOpen} onOpenChange={open => !open && closeBottomSheet()}>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader className='flex flex-col items-center'>
          <DrawerTitle>어떤 요리를 찾으세요?</DrawerTitle>
          <Button
            variant={'ghost'}
            size='sm'
            colorScheme={'primary'}
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
        <DrawerFooter className='flex flex-row gap-2'>
          <Button
            variant='solid'
            colorScheme='primary'
            size='lg'
            className='flex-1'
            onClick={handleApply}
            disabled={!hasAnyFilter}
          >
            요리 보러가기
          </Button>
          <Button
            variant='solid'
            colorScheme='secondary'
            size='lg'
            onClick={handleApplyEmpty}
          >
            조건 없이 보기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
