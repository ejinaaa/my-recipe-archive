import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

function HorizontalScroll({ children, className }: HorizontalScrollProps) {
  return (
    <div className='overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      <div className={cn('inline-flex', className)}>
        {children}
      </div>
    </div>
  );
}

export { HorizontalScroll };
