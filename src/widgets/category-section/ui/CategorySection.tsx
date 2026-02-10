'use client';

import { useRouter } from 'next/navigation';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import { CategoryChip } from '@/entities/category/ui/CategoryChip';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { Section, SectionHeader } from '@/shared/ui/section';

/**
 * 홈 카테고리 수평 스크롤 섹션
 * situation 타입 카테고리를 칩 형태로 수평 스크롤 표시
 */
export function CategorySection() {
  const router = useRouter();
  const { data: categoryGroups } = useSuspenseCategoryGroups();

  const situationGroup = categoryGroups.find(g => g.type === 'situation');
  const categories = situationGroup?.options ?? [];

  if (categories.length === 0) return null;

  const handleCategoryClick = (code: string) => {
    router.push(`/search/results?situation=${code}`);
  };

  return (
    <Section>
      <SectionHeader title='어떤 요리를 찾아볼까요?' />

      <HorizontalScroll className='gap-2 px-4'>
        {categories.map(category => (
          <CategoryChip
            key={category.id}
            category={category}
            onClick={() => handleCategoryClick(category.code)}
          />
        ))}
      </HorizontalScroll>
    </Section>
  );
}
