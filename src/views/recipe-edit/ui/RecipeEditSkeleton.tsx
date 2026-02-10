import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { BottomNavigation } from '@/widgets/bottom-navigation';

export function RecipeEditSkeleton() {
  return (
    <div className='h-dvh flex flex-col bg-background'>
      {/* Header */}
      <PageHeader>
        <div className='relative flex items-center justify-center'>
          <Skeleton className='absolute left-0 size-10 rounded-full' />
          <Skeleton className='h-6 w-48' />
        </div>
      </PageHeader>

      {/* Form Skeleton */}
      <main className='flex-1 overflow-y-auto'>
        <div className='px-4 pt-6 flex flex-col gap-6'>
          {/* 썸네일 */}
          <div className='flex flex-col items-center gap-2'>
            <Skeleton className='size-24 rounded-full' />
            <Skeleton className='h-3 w-32' />
          </div>

          {/* 제목 */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-12 w-full rounded-xl' />
          </div>

          {/* 설명 */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-24 w-full rounded-xl' />
          </div>

          {/* 인분 */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-8 w-full rounded-full' />
          </div>

          {/* 조리 시간 */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-8 w-full rounded-full' />
          </div>

          {/* 카테고리들 */}
          {[1, 2, 3].map(i => (
            <div key={i} className='flex flex-col gap-3'>
              <Skeleton className='h-4 w-24' />
              <div className='flex flex-wrap gap-2'>
                {[1, 2, 3, 4, 5].map(j => (
                  <Skeleton key={j} className='h-8 w-16 rounded-full' />
                ))}
              </div>
            </div>
          ))}

          {/* 재료 */}
          <div className='flex flex-col gap-3'>
            <Skeleton className='h-4 w-20' />
            <div className='flex gap-2'>
              <Skeleton className='h-12 flex-1 rounded-xl' />
              <Skeleton className='h-12 w-16 rounded-xl' />
              <Skeleton className='h-12 w-16 rounded-xl' />
              <Skeleton className='size-10 rounded-full' />
              <Skeleton className='size-10 rounded-full' />
            </div>
          </div>

          {/* 조리 단계 */}
          <div className='flex flex-col gap-3'>
            <Skeleton className='h-4 w-20' />
            <div className='flex gap-2 items-start'>
              <Skeleton className='size-8 rounded-full shrink-0' />
              <Skeleton className='h-20 flex-1 rounded-xl' />
              <Skeleton className='size-10 rounded-full shrink-0' />
              <Skeleton className='size-10 rounded-full shrink-0' />
            </div>
          </div>

          {/* 제출 버튼 */}
          <Skeleton className='h-14 w-full rounded-full mt-4' />
        </div>
      </main>

      <BottomNavigation activeTab='register' />
    </div>
  );
}
