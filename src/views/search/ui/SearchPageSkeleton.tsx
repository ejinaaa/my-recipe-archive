import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import { SearchBar } from '@/features/recipe-search';
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';
import { PageContent } from '@/shared/ui/page-content';
import { PageHeader } from '@/shared/ui/page-header';
import { Section, SectionHeader } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';

export function SearchPageSkeleton() {
  return (
    <>
      {/* Header */}
      <PageHeader>
        <SearchBar disabled onSearch={() => {}} />
      </PageHeader>

      {/* Main */}
      <PageContent className='space-y-6 py-6'>
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
      </PageContent>
    </>
  );
}
