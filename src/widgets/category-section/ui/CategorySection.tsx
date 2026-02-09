'use client';

import { useRouter } from 'next/navigation';
import { useSuspenseCategoryGroups } from '@/entities/category/api/hooks';
import { CategoryChip } from '@/entities/category/ui/CategoryChip';

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
    <section>
      {/* 섹션 헤더 */}
      <div className='px-4 mb-3'>
        <h2 className='text-heading-3 text-text-primary'>
          어떤 요리를 찾아볼까요?
        </h2>
      </div>

      {/* 수평 스크롤 카테고리 칩 */}
      <div className='overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <div className='flex gap-2 px-4'>
          {categories.map(category => (
            <CategoryChip
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category.code)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
