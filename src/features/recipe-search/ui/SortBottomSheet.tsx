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
import { useSortStore, SORT_OPTIONS } from '../model/sortStore';

export function SortBottomSheet() {
  const { isOpen, sortBy, closeBottomSheet, applySortBy } = useSortStore();

  // 로컬 상태 (바텀시트 내 편집용)
  const [tempSortBy, setTempSortBy] = useState<RecipeSortBy>(sortBy);

  // 바텀시트 열릴 때 전역 상태를 로컬로 복사
  useEffect(() => {
    if (isOpen) {
      setTempSortBy(sortBy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleApply = () => {
    applySortBy(tempSortBy);
  };

  return (
    <Drawer open={isOpen} onOpenChange={open => !open && closeBottomSheet()}>
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
                {option.label}
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
