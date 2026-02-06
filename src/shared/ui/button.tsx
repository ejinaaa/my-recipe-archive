import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border-[1px] bg-transparent',
        ghost: 'bg-transparent',
      },
      colorScheme: {
        primary: '',
        secondary: '',
        neutral: '',
      },
      size: {
        sm: 'h-10 px-3 text-body-2 [&_svg]:size-4',
        md: 'h-12 px-4 text-body-1 [&_svg]:size-4',
        lg: 'h-14 px-[18px] text-body-1 [&_svg]:size-5',
      },
      transparent: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Solid + Primary
      {
        variant: 'solid',
        colorScheme: 'primary',
        transparent: false,
        className:
          'bg-primary-base text-text-primary focus-visible:ring-primary-base',
      },
      {
        variant: 'solid',
        colorScheme: 'primary',
        transparent: true,
        className:
          'bg-primary-base/60 text-text-primary focus-visible:ring-primary-base backdrop-blur-sm',
      },
      // Solid + Secondary
      {
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: false,
        className:
          'bg-secondary-base text-text-primary focus-visible:ring-secondary-base',
      },
      {
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: true,
        className:
          'bg-secondary-base/60 text-text-primary focus-visible:ring-secondary-base backdrop-blur-sm',
      },
      // Solid + Neutral
      {
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: false,
        className:
          'bg-neutral-base text-text-primary focus-visible:ring-neutral-base',
      },
      {
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: true,
        className:
          'bg-neutral-base/60 text-text-primary focus-visible:ring-neutral-base backdrop-blur-sm',
      },
      // Outline + Primary
      {
        variant: 'outline',
        colorScheme: 'primary',
        className:
          'border-primary-base text-primary-base focus-visible:ring-primary-base',
      },
      // Outline + Secondary
      {
        variant: 'outline',
        colorScheme: 'secondary',
        className:
          'border-secondary-base text-secondary-base focus-visible:ring-secondary-base',
      },
      // Outline + Neutral
      {
        variant: 'outline',
        colorScheme: 'neutral',
        className:
          'border-neutral-base text-text-primary focus-visible:ring-neutral-base',
      },
      // Ghost + Primary
      {
        variant: 'ghost',
        colorScheme: 'primary',
        className: 'text-primary-base focus-visible:ring-primary-base',
      },
      // Ghost + Secondary
      {
        variant: 'ghost',
        colorScheme: 'secondary',
        className: 'text-secondary-base focus-visible:ring-secondary-base',
      },
      // Ghost + Neutral
      {
        variant: 'ghost',
        colorScheme: 'neutral',
        className: 'text-text-primary focus-visible:ring-neutral-base',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      colorScheme: 'primary',
      size: 'md',
      transparent: false,
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      colorScheme,
      size,
      transparent,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            colorScheme,
            size,
            transparent,
            className,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
