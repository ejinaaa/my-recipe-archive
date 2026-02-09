import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import { Skeleton } from '@/shared/ui/skeleton';

export function SearchPageSkeleton() {
  return (
    <div className='min-h-screen pb-20 bg-background'>
      {/* Header */}
      <header className='px-4 pt-4 pb-6'>
        <Skeleton className='h-12 w-full rounded-full' />
      </header>

      {/* Main */}
      <main className='space-y-6 pb-6'>
        {/* 장르별 섹션 */}
        <section className='px-4'>
          <h2 className='text-heading-3 text-text-primary mb-3'>
            {CATEGORY_TYPE_LABELS.cuisine}
          </h2>
          <div className='flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-16 w-32 rounded-full shrink-0' />
            ))}
          </div>
        </section>

        {/* 상황별 섹션 */}
        <section className='px-4'>
          <h2 className='text-heading-3 text-text-primary mb-3'>
            {CATEGORY_TYPE_LABELS.situation}
          </h2>
          <div className='grid grid-cols-2 gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='aspect-[4/3] rounded-2xl' />
            ))}
          </div>
        </section>

        {/* 종류별 섹션 */}
        <section className='px-4'>
          <h2 className='text-heading-3 text-text-primary mb-3'>
            {CATEGORY_TYPE_LABELS.dishType}
          </h2>
          <div className='grid grid-cols-2 gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='aspect-[4/3] rounded-2xl' />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
