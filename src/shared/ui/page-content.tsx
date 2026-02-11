import { cn } from '@/shared/lib/utils';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 페이지 공통 메인 콘텐츠 레이아웃
 * 기본 스타일: flex-1 overflow-y-auto
 */
export function PageContent({ children, className }: PageContentProps) {
  return (
    <main className={cn('flex-1 overflow-y-auto', className)}>
      {children}
    </main>
  );
}
