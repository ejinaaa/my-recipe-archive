import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const inputVariants = cva(
  'flex w-full transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        filled: 'border-0 hover:bg-neutral-hover focus:bg-neutral-hover',
      },
      size: {
        sm: 'h-10 px-5 text-body-2 rounded-full',
        md: 'h-12 px-6 text-body-1 rounded-full',
        lg: 'h-14 px-6 text-body-1 rounded-full',
      },
      colorScheme: {
        neutral:
          'bg-neutral-base text-text-primary placeholder:text-text-secondary/60',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      colorScheme: 'neutral',
    },
  },
);

export interface InputProps
  extends
    Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant = 'filled',
      size = 'md',
      colorScheme = 'neutral',
      ...props
    },
    ref,
  ) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, colorScheme }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input, inputVariants };
