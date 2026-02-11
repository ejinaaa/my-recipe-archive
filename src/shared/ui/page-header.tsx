import { cn } from '@/shared/lib/utils';

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 페이지 공통 헤더 레이아웃
 * 기본 스타일: px-4 py-3
 */
export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'relative px-4 py-3 flex items-center justify-between gap-2 min-h-16',
        className,
      )}
    >
      {children}
    </header>
  );
}
