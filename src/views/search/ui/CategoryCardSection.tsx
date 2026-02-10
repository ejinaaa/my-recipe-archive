'use client';

import type { CategoryOption, CategoryType } from '@/entities/category/model/types';
import { CategoryCard } from '@/entities/category/ui';
import { Section, SectionHeader } from '@/shared/ui/section';

interface CategoryCardSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 카테고리 타입 */
  type: CategoryType;
  /** 카테고리 목록 */
  categories: CategoryOption[];
  /** 카테고리 선택 핸들러 */
  onSelect: (type: CategoryType, code: string) => void;
}

export function CategoryCardSection({
  title,
  type,
  categories,
  onSelect,
}: CategoryCardSectionProps) {
  return (
    <Section>
      <SectionHeader title={title} />
      <div className='grid grid-cols-2 gap-3 px-4'>
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => onSelect(type, category.code)}
          />
        ))}
      </div>
    </Section>
  );
}
