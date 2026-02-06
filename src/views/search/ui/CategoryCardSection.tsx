'use client';

import type { CategoryOption, CategoryType } from '@/entities/category/model/types';
import { CategoryCard } from '@/entities/category/ui';
import { Skeleton } from '@/shared/ui/skeleton';

interface CategoryCardSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 카테고리 타입 */
  type: CategoryType;
  /** 카테고리 목록 */
  categories: CategoryOption[];
  /** 카테고리 선택 핸들러 */
  onSelect: (type: CategoryType, code: string) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}

export function CategoryCardSection({
  title,
  type,
  categories,
  onSelect,
  isLoading,
}: CategoryCardSectionProps) {
  if (isLoading) {
    return (
      <section className='px-4'>
        <h2 className='text-heading-3 text-text-primary mb-3'>{title}</h2>
        <div className='grid grid-cols-2 gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='aspect-[4/3] rounded-2xl' />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className='px-4'>
      <h2 className='text-heading-3 text-text-primary mb-3'>{title}</h2>
      <div className='grid grid-cols-2 gap-3'>
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => onSelect(type, category.code)}
          />
        ))}
      </div>
    </section>
  );
}
