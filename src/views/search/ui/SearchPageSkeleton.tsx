import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { Section, SectionHeader } from '@/shared/ui/section';
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
        <Section>
          <SectionHeader title={CATEGORY_TYPE_LABELS.cuisine} />
          <HorizontalScroll className='gap-2 px-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-16 w-32 rounded-full shrink-0' />
            ))}
          </HorizontalScroll>
        </Section>

        {/* 상황별 섹션 */}
        <Section>
          <SectionHeader title={CATEGORY_TYPE_LABELS.situation} />
          <div className='grid grid-cols-2 gap-3 px-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='aspect-[4/3] rounded-2xl' />
            ))}
          </div>
        </Section>

        {/* 종류별 섹션 */}
        <Section>
          <SectionHeader title={CATEGORY_TYPE_LABELS.dishType} />
          <div className='grid grid-cols-2 gap-3 px-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='aspect-[4/3] rounded-2xl' />
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
