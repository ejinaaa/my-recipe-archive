'use client';

import Image from 'next/image';
import { CookingPot } from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import type { CategoryOption } from '../model/types';

interface CategoryChipProps {
  /** 카테고리 데이터 */
  category: CategoryOption;
  /** 클릭 핸들러 */
  onClick: () => void;
}

/**
 * 원형 이미지 + 라벨 형태의 카테고리 칩
 * 수평 스크롤 섹션에서 사용
 */
export function CategoryChip({ category, onClick }: CategoryChipProps) {
  const { hasValidImage: hasImage, handleError: handleImageError } =
    useImageError(category.image_url);

  return (
    <button
      type='button'
      onClick={onClick}
      className='flex items-center gap-2 pl-1 pr-4 py-0.5 rounded-full border border-neutral-300 bg-white shrink-0'
    >
      <div className='relative size-14 rounded-full overflow-hidden bg-neutral-100'>
        {hasImage ? (
          <Image
            src={category.image_url!}
            alt={category.name}
            fill
            className='object-cover'
            onError={handleImageError}
          />
        ) : (
          <div className='flex items-center justify-center size-full'>
            <CookingPot className='size-4 text-text-secondary' />
          </div>
        )}
      </div>
      <span className='text-body-1 text-text-primary'>{category.name}</span>
    </button>
  );
}
