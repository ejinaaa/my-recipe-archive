import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { buttonVariants } from './button';

export interface LinkButtonProps
  extends ComponentProps<typeof Link>,
    VariantProps<typeof buttonVariants> {}

/**
 * Button과 동일한 디자인 시스템을 사용하는 Link 컴포넌트
 * href를 통한 페이지 이동이 필요할 때 사용
 */
function LinkButton({
  className,
  variant,
  colorScheme,
  size,
  transparent,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        buttonVariants({ variant, colorScheme, size, transparent, className })
      )}
      {...props}
    />
  );
}

export { LinkButton };
