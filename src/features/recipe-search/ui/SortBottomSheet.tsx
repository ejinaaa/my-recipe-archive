'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from '@/shared/ui/drawer';
import type { RecipeSortBy } from '@/entities/recipe/api/server';
import { SORT_OPTIONS } from '../model/sortStore';

interface SortBottomSheetProps {
  /** 바텀시트 열림 상태 */
  open: boolean;
  /** 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
  /** 초기 정렬값 */
  initialSortBy?: RecipeSortBy;
  /** 정렬 적용 핸들러 */
  onApply: (sortBy: RecipeSortBy) => void;
}

/**
 * 정렬 바텀시트 (순수 UI 컴포넌트)
 *
 * URL/store 로직 없이 props만으로 동작.
 */
export function SortBottomSheet({
  open,
  onOpenChange,
  initialSortBy = 'latest',
  onApply,
}: SortBottomSheetProps) {
  // 로컬 임시 상태 (바텀시트 내 편집용)
  const [tempSortBy, setTempSortBy] = useState<RecipeSortBy>(initialSortBy);

  // 바텀시트 열릴 때 초기값으로 리셋
  useEffect(() => {
    if (open) {
      setTempSortBy(initialSortBy);
    }
  }, [open, initialSortBy]);

  const handleApply = () => {
    onApply(tempSortBy);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {/* Header */}
        <DrawerHeader className='relative flex items-center justify-center'>
          <DrawerTitle>어떤 순서로 볼까요?</DrawerTitle>
        </DrawerHeader>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-4 pt-4 pb-10'>
          <div className='flex flex-wrap gap-2'>
            {SORT_OPTIONS.map(option => (
              <Badge
                key={option.value}
                variant='outline'
                colorScheme='neutral'
                size='md'
                selected={tempSortBy === option.value}
                onClick={() => setTempSortBy(option.value)}
              >
                {option.icon}{option.label}
              </Badge>
            ))}
          </div>
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
            이 순서로 보기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
