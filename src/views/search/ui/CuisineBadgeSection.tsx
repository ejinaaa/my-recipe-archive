'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Utensils } from 'lucide-react';
import type { CategoryOption } from '@/entities/category/model/types';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';

interface CuisineBadgeSectionProps {
  /** 장르별 카테고리 목록 */
  cuisines: CategoryOption[];
  /** 카테고리 선택 핸들러 */
  onSelect: (code: string) => void;
}

function CuisineChip({
  cuisine,
  onClick,
}: {
  cuisine: CategoryOption;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const hasImage = cuisine.image_url && !imageError;

  return (
    <button
      type='button'
      onClick={onClick}
      className='flex items-center gap-2 pl-1 pr-4 py-0.5 rounded-full border border-neutral-300 bg-white shrink-0'
    >
      {/* 원형 이미지 */}
      <div className='relative size-14 rounded-full overflow-hidden bg-neutral-100'>
        {hasImage ? (
          <Image
            src={cuisine.image_url!}
            alt={cuisine.name}
            fill
            className='object-cover'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='flex items-center justify-center size-full'>
            <Utensils className='size-4 text-text-secondary' />
          </div>
        )}
      </div>
      {/* 라벨 */}
      <span className='text-body-1 text-text-primary'>{cuisine.name}</span>
    </button>
  );
}

export function CuisineBadgeSection({
  cuisines,
  onSelect,
}: CuisineBadgeSectionProps) {
  return (
    <section className='px-4'>
      <h2 className='text-heading-3 text-text-primary mb-3'>
        {CATEGORY_TYPE_LABELS.cuisine}
      </h2>
      <div className='flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {cuisines.map(cuisine => (
          <CuisineChip
            key={cuisine.id}
            cuisine={cuisine}
            onClick={() => onSelect(cuisine.code)}
          />
        ))}
      </div>
    </section>
  );
}
