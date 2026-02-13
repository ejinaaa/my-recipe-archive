import { Skeleton } from '@/shared/ui/skeleton';

/**
 * 레시피 상세 페이지 로딩 스켈레톤
 */
export function RecipeDetailSkeleton() {
  return (
    <div className='relative min-h-screen bg-background'>
      {/* Header */}
      <div className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-5 py-2'>
        <Skeleton className='size-10 rounded-full' />
        <Skeleton className='size-10 rounded-full' />
      </div>

      {/* 썸네일 - 350px 고정 */}
      <Skeleton className='w-full h-[350px] rounded-b-3xl' />

      {/* 컨텐츠 */}
      <div className='pt-6 px-5 pb-20'>
        {/* 배지 */}
        <div className='flex gap-1.5 mb-4'>
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-16 rounded-full' />
        </div>

        {/* 제목 & 설명 */}
        <Skeleton className='h-6 w-3/4 mb-1' />
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-2/3 mb-14' />

        {/* 재료 섹션 */}
        <Skeleton className='h-5 w-12 mb-4' />
        <div className='flex flex-wrap gap-2 mb-14'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-8 w-24 rounded-full' />
          ))}
        </div>

        {/* 조리 순서 섹션 */}
        <Skeleton className='h-5 w-20 mb-4' />
        {[...Array(3)].map((_, i) => (
          <div key={i} className='flex gap-3 mb-6'>
            <Skeleton className='size-6 rounded-full flex-shrink-0' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
