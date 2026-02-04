import { Skeleton } from '@/shared/ui/skeleton';

export function RecipeCardSkeleton() {
  return (
    <div className='relative h-[280px] w-full max-w-[400px] overflow-hidden rounded-[20px]'>
      {/* 배경 이미지 영역 */}
      <Skeleton className='absolute inset-0' />

      {/* 하단 콘텐츠 영역 */}
      <div className='absolute bottom-0 left-0 right-0 p-4 space-y-2'>
        {/* 배지 스켈레톤 */}
        <div className='flex gap-1'>
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-16 rounded-full' />
        </div>

        {/* 제목 스켈레톤 */}
        <Skeleton className='h-5 w-3/4 rounded-md' />

        {/* 설명 스켈레톤 */}
        <Skeleton className='h-4 w-1/2 rounded-md' />
      </div>
    </div>
  );
}
