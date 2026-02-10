import { Skeleton } from '@/shared/ui/skeleton';
import { Section, SectionHeader } from '@/shared/ui/section';

/**
 * CategorySection 로딩 스켈레톤
 */
export function CategorySectionSkeleton() {
  return (
    <Section>
      <SectionHeader title='어떤 요리를 찾아볼까요?' />
      <div className='flex gap-2 px-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-[60px] w-[120px] flex-shrink-0 rounded-full'
          />
        ))}
      </div>
    </Section>
  );
}
