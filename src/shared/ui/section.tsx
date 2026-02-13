import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { LinkButton } from '@/shared/ui/link-button';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

function Section({ children, className }: SectionProps) {
  return <section className={className}>{children}</section>;
}

interface SectionHeaderProps {
  title: string;
  /** heading 크기 (sm: text-heading-3, lg: text-heading-2) */
  size?: 'sm' | 'lg';
  /** 더보기 링크 경로 (없으면 버튼 미표시) */
  moreHref?: string;
  /** 더보기 버튼 비활성화 여부 */
  disabled?: boolean;
}

function SectionHeader({
  title,
  size = 'sm',
  moreHref,
  disabled,
}: SectionHeaderProps) {
  return (
    <div className='flex items-center justify-between px-5 mb-3'>
      <h2
        className={cn(
          'text-text-primary',
          size === 'lg' ? 'text-heading-2' : 'text-heading-3',
        )}
      >
        {title}
      </h2>
      {moreHref &&
        (disabled ? (
          <span className='inline-flex items-center justify-center size-10 p-0 text-primary-base/40'>
            <ChevronRight className='size-4' />
          </span>
        ) : (
          <LinkButton
            href={moreHref}
            variant='ghost'
            colorScheme='primary'
            size='sm'
            className='text-primary gap-0.5 px-1'
          >
            <ChevronRight className='size-4' />
          </LinkButton>
        ))}
    </div>
  );
}

export { Section, SectionHeader };
export type { SectionProps, SectionHeaderProps };
