'use client';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import type {
  CategoryOption,
  CategoryType,
} from '@/entities/category/model/types';

/**
 * 카테고리 타입별 한글 라벨
 */
const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  situation: '상황별',
  cuisine: '장르별',
  dishType: '종류별',
};

interface CategoryFilterSectionProps {
  type: CategoryType;
  options: CategoryOption[];
  selectedCodes: string[];
  onToggle: (code: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function CategoryFilterSection({
  type,
  options,
  selectedCodes,
  onToggle,
  isLoading,
  isError,
  onRetry,
}: CategoryFilterSectionProps) {
  const title = CATEGORY_TYPE_LABELS[type];

  // 로딩 상태
  if (isLoading) {
    return (
      <section className='space-y-3'>
        <h3 className='text-heading-3 text-text-primary'>{title}</h3>
        <div className='flex flex-wrap gap-2'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-16 rounded-full' />
          ))}
        </div>
      </section>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <section className='space-y-3'>
        <h3 className='text-heading-3 text-text-primary'>{title}</h3>
        <div className='flex items-center gap-3 rounded-lg bg-neutral-base p-4'>
          <p className='text-body-2 text-text-secondary'>
            카테고리를 불러오지 못했어요
          </p>
          {onRetry && (
            <Button
              variant='ghost'
              colorScheme='neutral'
              size='sm'
              onClick={onRetry}
              className='shrink-0'
            >
              <RefreshCw className='size-4' />
              다시 시도
            </Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className='space-y-3'>
      <h3 className='text-heading-3 text-text-primary'>{title}</h3>
      <div className='flex flex-wrap gap-2'>
        {options.map(option => {
          const isSelected = selectedCodes.includes(option.code);
          return (
            <Badge
              key={option.id}
              variant='outline'
              colorScheme='neutral'
              size='md'
              selected={isSelected}
              onClick={() => onToggle(option.code)}
            >
              {option.icon}
              {option.name}
            </Badge>
          );
        })}
      </div>
    </section>
  );
}
