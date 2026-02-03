import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
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
        sm: 'h-7 px-2.5 text-caption [&_svg]:size-3',
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
        className:
          'bg-primary-base text-white hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary-base',
      },
      {
        variant: 'solid',
        colorScheme: 'primary',
        transparent: true,
        className:
          'bg-primary-base/60 text-white hover:bg-primary-hover/60 active:bg-primary-active/60 focus-visible:ring-primary-base backdrop-blur-sm',
      },
      // Solid + Secondary
      {
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: false,
        className:
          'bg-secondary-base text-text-primary hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-secondary-base',
      },
      {
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: true,
        className:
          'bg-secondary-base/60 text-text-primary hover:bg-secondary-hover/60 active:bg-secondary-active/60 focus-visible:ring-secondary-base backdrop-blur-sm',
      },
      // Solid + Neutral (연한 회색)
      {
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: false,
        selected: false,
        className:
          'bg-neutral-base text-text-primary hover:bg-neutral-hover active:bg-neutral-active focus-visible:ring-neutral-base',
      },
      {
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: true,
        selected: false,
        className:
          'bg-neutral-base/60 text-text-primary hover:bg-neutral-hover/60 active:bg-neutral-active/60 focus-visible:ring-neutral-base backdrop-blur-sm',
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
        className:
          'border-primary-base text-primary-base hover:border-transparent hover:bg-primary-base hover:text-white active:border-transparent active:bg-primary-hover active:text-white focus-visible:ring-primary-base',
      },
      {
        variant: 'outline',
        colorScheme: 'primary',
        transparent: true,
        className:
          'border-primary-base/60 text-primary-base hover:border-transparent hover:bg-primary-base/60 hover:text-white active:border-transparent active:bg-primary-hover/60 active:text-white focus-visible:ring-primary-base backdrop-blur-sm',
      },
      // Outline + Secondary
      {
        variant: 'outline',
        colorScheme: 'secondary',
        transparent: false,
        className:
          'border-secondary-base text-secondary-base hover:border-transparent hover:bg-secondary-base hover:text-text-primary active:border-transparent active:bg-secondary-hover active:text-text-primary focus-visible:ring-secondary-base',
      },
      {
        variant: 'outline',
        colorScheme: 'secondary',
        transparent: true,
        className:
          'border-secondary-base/60 text-secondary-base hover:border-transparent hover:bg-secondary-base/60 hover:text-text-primary active:border-transparent active:bg-secondary-hover/60 active:text-text-primary focus-visible:ring-secondary-base backdrop-blur-sm',
      },
      // Outline + Neutral
      {
        variant: 'outline',
        colorScheme: 'neutral',
        transparent: false,
        className:
          'border-neutral-active text-text-primary hover:border-transparent hover:bg-text-primary hover:text-white active:border-transparent active:bg-text-primary/90 active:text-white focus-visible:ring-text-primary',
      },
      {
        variant: 'outline',
        colorScheme: 'neutral',
        transparent: true,
        className:
          'border-neutral-active/60 text-text-primary hover:border-transparent hover:bg-text-primary/60 hover:text-white active:border-transparent active:bg-text-primary/70 active:text-white focus-visible:ring-text-primary backdrop-blur-sm',
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
        className:
          'bg-primary-active text-white hover:bg-primary-hover active:bg-primary-active/90 focus-visible:ring-primary-base',
      },
      // Selected + Solid + Secondary
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'secondary',
        className:
          'bg-secondary-active text-text-primary hover:bg-secondary-hover active:bg-secondary-active/90 focus-visible:ring-secondary-base',
      },
      // Selected + Solid + Neutral
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'neutral',
        className:
          'bg-text-primary text-white hover:bg-text-primary/90 active:bg-text-primary/60 focus-visible:ring-text-primary',
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
        className:
          'border-transparent bg-primary-base text-white hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary-base',
      },
      // Selected + Outline + Secondary
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'secondary',
        className:
          'border-transparent bg-secondary-base text-text-primary hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-secondary-base',
      },
      // Selected + Outline + Neutral
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'neutral',
        className:
          'border-transparent bg-text-primary text-white hover:bg-text-primary/90 active:bg-text-primary/60 focus-visible:ring-text-primary',
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
        className:
          'bg-primary-active/60 text-white hover:bg-primary-hover/60 active:bg-primary-active/70 focus-visible:ring-primary-base backdrop-blur-sm',
      },
      // Selected + Solid + Secondary + Transparent
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'secondary',
        transparent: true,
        className:
          'bg-secondary-active/60 text-text-primary hover:bg-secondary-hover/60 active:bg-secondary-active/70 focus-visible:ring-secondary-base backdrop-blur-sm',
      },
      // Selected + Solid + Neutral + Transparent
      {
        selected: true,
        variant: 'solid',
        colorScheme: 'neutral',
        transparent: true,
        className:
          'bg-text-primary/60 text-white hover:bg-text-primary/70 active:bg-text-primary/60 focus-visible:ring-text-primary backdrop-blur-sm',
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
          'border-transparent bg-primary-base/60 text-white hover:bg-primary-hover/60 active:bg-primary-active/60 focus-visible:ring-primary-base backdrop-blur-sm',
      },
      // Selected + Outline + Secondary + Transparent
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'secondary',
        transparent: true,
        className:
          'border-transparent bg-secondary-base/60 text-text-primary hover:bg-secondary-hover/60 active:bg-secondary-active/60 focus-visible:ring-secondary-base backdrop-blur-sm',
      },
      // Selected + Outline + Neutral + Transparent
      {
        selected: true,
        variant: 'outline',
        colorScheme: 'neutral',
        transparent: true,
        className:
          'border-transparent bg-text-primary/60 text-white hover:bg-text-primary/70 active:bg-text-primary/60 focus-visible:ring-text-primary backdrop-blur-sm',
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
  }
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
    ref
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
          })
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
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
