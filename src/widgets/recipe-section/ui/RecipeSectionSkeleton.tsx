import { Skeleton } from '@/shared/ui/skeleton';

/**
 * RecipeSection 로딩 스켈레톤
 */
export function RecipeSectionSkeleton() {
  return (
    <section>
      {/* 섹션 헤더 스켈레톤 */}
      <div className='flex items-center justify-between px-4 mb-3'>
        <Skeleton className='h-6 w-40 rounded-md' />
        <Skeleton className='h-5 w-16 rounded-md' />
      </div>

      {/* 카드 스켈레톤 */}
      <div className='flex gap-3 px-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-[200px] w-[160px] flex-shrink-0 rounded-2xl' />
        ))}
      </div>
    </section>
  );
}
