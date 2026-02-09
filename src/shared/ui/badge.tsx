import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border-[1px] bg-transparent',
      },
      colorScheme: {
        primary: '',
        secondary: '',
        neutral: '',
        surface: '',
      },
      size: {
        sm: 'h-6 px-1.5 text-caption [&_svg]:size-3',
        md: 'h-8 px-3 text-body-2 [&_svg]:size-3.5',
        lg: 'h-9 px-4 text-body-1 [&_svg]:size-4',
      },
      transparent: {
        true: '',
        false: '',
      },
      selected: {
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
        className: 'bg-primary-base text-white',
      },
      {
        variant: 'solid',
        colorScheme: 'primary',
        transparent: true,
        className: 'bg-primary-base/60 text-white backdrop-blur-sm',
      },
      // Solid + Secondary
      {
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: false,
        className: 'bg-secondary-base text-text-primary',
      },
      {
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: true,
        className: 'bg-secondary-base/60 text-text-primary backdrop-blur-sm',
      },
      // Solid + Neutral (연한 회색)
      {
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: false,
        selected: false,
        className: 'bg-neutral-base text-text-primary',
      },
      {
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: true,
        selected: false,
        className: 'bg-neutral-base/60 text-text-primary backdrop-blur-sm',
      },
      // Solid + Surface (연한 베이지)
      {
        variant: 'solid',
        colorScheme: 'surface',
        transparent: false,
        selected: false,
        className: 'bg-surface text-text-primary',
      },
      {
        variant: 'solid',
        colorScheme: 'surface',
        transparent: true,
        selected: false,
        className: 'bg-surface/60 text-text-primary',
      },
      // Outline + Primary
      {
        variant: 'outline',
        colorScheme: 'primary',
        transparent: false,
        className: 'border-primary-base text-primary-base',
      },
      {
        variant: 'outline',
        colorScheme: 'primary',
        transparent: true,
        className: 'border-primary-base/60 text-primary-base backdrop-blur-sm',
      },
      // Outline + Secondary
      {
        variant: 'outline',
        colorScheme: 'secondary',
        transparent: false,
        className: 'border-secondary-base text-secondary-base',
      },
      {
        variant: 'outline',
        colorScheme: 'secondary',
        transparent: true,
        className:
          'border-secondary-base/60 text-secondary-base backdrop-blur-sm',
      },
      // Outline + Neutral
      {
        variant: 'outline',
        colorScheme: 'neutral',
        transparent: false,
        className: 'border-neutral-active text-text-primary',
      },
      {
        variant: 'outline',
        colorScheme: 'neutral',
        transparent: true,
        className:
          'border-neutral-active/60 text-text-primary backdrop-blur-sm',
      },
      // Outline + Surface
      {
        variant: 'outline',
        colorScheme: 'surface',
        transparent: false,
        className: 'border-surface text-text-primary',
      },
      {
        variant: 'outline',
        colorScheme: 'surface',
        transparent: true,
        className: 'border-surface/60 text-text-primary',
      },
      // Selected + Solid + Primary
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'primary',
        className: 'bg-primary-active text-white',
      },
      // Selected + Solid + Secondary
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'secondary',
        className: 'bg-secondary-active text-text-primary',
      },
      // Selected + Solid + Neutral
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'neutral',
        className: 'bg-text-primary text-white',
      },
      // Selected + Solid + Surface
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'surface',
        className: 'bg-text-primary text-white',
      },
      // Selected + Outline + Primary
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'primary',
        className: 'border-transparent bg-primary-base text-white',
      },
      // Selected + Outline + Secondary
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'secondary',
        className: 'border-transparent bg-secondary-base text-text-primary',
      },
      // Selected + Outline + Neutral
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'neutral',
        className: 'border-transparent bg-text-primary text-white',
      },
      // Selected + Outline + Surface
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'surface',
        className: 'border-transparent bg-text-primary text-white',
      },
      // Selected + Solid + Primary + Transparent
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'primary',
        transparent: true,
        className: 'bg-primary-active/60 text-white backdrop-blur-sm',
      },
      // Selected + Solid + Secondary + Transparent
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: true,
        className: 'bg-secondary-active/60 text-text-primary backdrop-blur-sm',
      },
      // Selected + Solid + Neutral + Transparent
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: true,
        className: 'bg-text-primary/60 text-white backdrop-blur-sm',
      },
      // Selected + Solid + Surface + Transparent
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'surface',
        transparent: true,
        className: 'bg-text-primary/60 text-white',
      },
      // Selected + Outline + Primary + Transparent
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'primary',
        transparent: true,
        className:
          'border-transparent bg-primary-base/60 text-white backdrop-blur-sm',
      },
      // Selected + Outline + Secondary + Transparent
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'secondary',
        transparent: true,
        className:
          'border-transparent bg-secondary-base/60 text-text-primary backdrop-blur-sm',
      },
      // Selected + Outline + Neutral + Transparent
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'neutral',
        transparent: true,
        className:
          'border-transparent bg-text-primary/60 text-white backdrop-blur-sm',
      },
      // Selected + Outline + Surface + Transparent
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'surface',
        transparent: true,
        className: 'border-transparent bg-text-primary/60 text-white',
      },
    ],
    defaultVariants: {
      variant: 'outline',
      colorScheme: 'neutral',
      size: 'md',
      transparent: false,
      selected: false,
    },
  },
);

type BadgeBaseProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

type BadgePropsWithClose = BadgeBaseProps & {
  closable: true;
  onClose: () => void;
};

type BadgePropsWithoutClose = BadgeBaseProps & {
  closable?: false;
  onClose?: never;
};

export type BadgeProps = BadgePropsWithClose | BadgePropsWithoutClose;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      colorScheme,
      size,
      transparent,
      selected,
      closable,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (closable && onClose) {
        onClose();
      }
    };

    return (
      <div
        className={cn(
          badgeVariants({
            variant,
            colorScheme,
            size,
            transparent,
            selected,
            className,
          }),
        )}
        ref={ref}
        {...props}
      >
        {children}
        {closable && (
          <button
            type='button'
            onClick={handleClose}
            className='ml-0.5 inline-flex shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 p-[2px]'
            aria-label='닫기'
          >
            <X className='size-[1em]' />
          </button>
        )}
      </div>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
