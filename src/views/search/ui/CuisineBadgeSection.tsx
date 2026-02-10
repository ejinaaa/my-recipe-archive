'use client';

import type { CategoryOption } from '@/entities/category/model/types';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import { CategoryChip } from '@/entities/category/ui/CategoryChip';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { Section, SectionHeader } from '@/shared/ui/section';

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
    <Section>
      <SectionHeader title={CATEGORY_TYPE_LABELS.cuisine} />
      <HorizontalScroll className='gap-2 px-4'>
        {cuisines.map(cuisine => (
          <CategoryChip
            key={cuisine.id}
            category={cuisine}
            onClick={() => onSelect(cuisine.code)}
          />
        ))}
      </HorizontalScroll>
    </Section>
  );
}
