import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import { SearchBar } from '@/features/recipe-search';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { PageHeader } from '@/shared/ui/page-header';
import { Section, SectionHeader } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';

export function SearchPageSkeleton() {
  return (
    <>
      {/* Header */}
      <PageHeader className='pb-6'>
        <SearchBar disabled onSearch={() => {}} />
      </PageHeader>

      {/* Main */}
      <main className='flex-1 overflow-y-auto space-y-6 pb-6'>
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
    </>
  );
}
