import { Skeleton } from '@/shared/ui/skeleton';

/**
 * CategorySection 로딩 스켈레톤
 */
export function CategorySectionSkeleton() {
  return (
    <section>
      {/* 섹션 헤더 스켈레톤 */}
      <div className='px-4 mb-3'>
        <Skeleton className='h-6 w-48 rounded-md' />
      </div>

      {/* 카테고리 칩 스켈레톤 */}
      <div className='flex gap-2 px-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-[60px] w-[120px] flex-shrink-0 rounded-full'
          />
        ))}
      </div>
    </section>
  );
}
