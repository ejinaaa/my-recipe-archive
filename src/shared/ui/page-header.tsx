import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  children: React.ReactNode;
  /** sticky 동작 여부 (기본: true) */
  sticky?: boolean;
  className?: string;
}

/**
 * 페이지 공통 헤더 레이아웃
 * 기본 스타일: sticky + px-4 pt-4 pb-3
 */
export function PageHeader({
  children,
  sticky = true,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'px-4 pt-4 pb-3',
        sticky && 'sticky top-0 z-10 bg-background',
        className,
      )}
    >
      {children}
    </header>
  );
}
