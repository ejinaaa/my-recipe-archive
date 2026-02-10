import { Section, SectionHeader } from '@/shared/ui/section';
import { Skeleton } from '@/shared/ui/skeleton';

interface RecipeCarouselSkeletonProps {
  /** 섹션 제목 */
  title: string;
  /** 더보기 버튼 표시 여부 */
  showMore?: boolean;
}

/**
 * RecipeCarousel 로딩 스켈레톤
 */
export function RecipeCarouselSkeleton({ title, showMore = true }: RecipeCarouselSkeletonProps) {
  return (
    <Section>
      <SectionHeader title={title} moreHref={showMore ? '#' : undefined} disabled />

      {/* 카드 스켈레톤 */}
      <div className='flex gap-3 px-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-[200px] w-[160px] flex-shrink-0 rounded-2xl' />
        ))}
      </div>
    </Section>
  );
}
