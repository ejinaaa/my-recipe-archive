'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Utensils } from 'lucide-react';
import type { CategoryOption } from '../model/types';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface CategoryCardProps {
  /** 카테고리 데이터 */
  category: CategoryOption;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 className */
  className?: string;
}

export function CategoryCard({
  category,
  onClick,
  className,
}: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = category.image_url && !imageError;

  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'relative w-full aspect-[4/3] rounded-2xl overflow-hidden',
        'bg-neutral-100',
        className,
      )}
    >
      {/* 배경 이미지 */}
      {hasImage ? (
        <>
          <Image
            src={category.image_url!}
            alt={category.name}
            fill
            className='object-cover'
            onError={() => setImageError(true)}
          />
          {/* 이미지 오버레이 */}
          <div className='absolute inset-0 bg-black/5' />
        </>
      ) : (
        /* Placeholder UI with icon */
        <div className='absolute inset-0 flex items-center justify-center'>
          <Utensils className='size-8 text-text-secondary' />
        </div>
      )}

      {/* 라벨 */}
      <Badge
        variant='solid'
        colorScheme='neutral'
        transparent
        size='sm'
        className='absolute top-2 left-2 pointer-events-none font-medium'
      >
        {category.name}
      </Badge>
    </button>
  );
}
