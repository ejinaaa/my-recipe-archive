import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const textareaVariants = cva(
  'flex w-full transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none',
  {
    variants: {
      variant: {
        filled: 'border-0 hover:bg-neutral-hover focus:bg-neutral-hover',
      },
      size: {
        sm: 'min-h-24 py-4 px-5 text-body-2 rounded-3xl',
        md: 'min-h-32 py-5 px-6 text-body-1 rounded-[32px]',
        lg: 'min-h-40 py-5 px-6 text-body-1 rounded-[40px]',
      },
      colorScheme: {
        neutral:
          'bg-neutral-base text-text-primary placeholder:text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      colorScheme: 'neutral',
    },
  }
);

export interface TextareaProps
  extends Omit<React.ComponentProps<'textarea'>, 'size'>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = 'filled',
      size = 'md',
      colorScheme = 'neutral',
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        data-slot='textarea'
        className={cn(
          textareaVariants({ variant, size, colorScheme }),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
