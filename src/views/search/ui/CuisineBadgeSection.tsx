'use client';

import type { CategoryOption } from '@/entities/category/model/types';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import { CategoryChip } from '@/entities/category/ui/CategoryChip';

interface CuisineBadgeSectionProps {
  /** 장르별 카테고리 목록 */
  cuisines: CategoryOption[];
  /** 카테고리 선택 핸들러 */
  onSelect: (code: string) => void;
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
          <CategoryChip
            key={cuisine.id}
            category={cuisine}
            onClick={() => onSelect(cuisine.code)}
          />
        ))}
      </div>
    </section>
  );
}
