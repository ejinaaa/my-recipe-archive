'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

// Context for sharing props between InputGroup and its children
type InputGroupContextValue = {
  variant: 'filled';
  size: 'sm' | 'md' | 'lg';
  colorScheme: 'neutral';
  disabled?: boolean;
};

const InputGroupContext = React.createContext<InputGroupContextValue>({
  variant: 'filled',
  size: 'md',
  colorScheme: 'neutral',
  disabled: false,
});

const useInputGroupContext = () => {
  const context = React.useContext(InputGroupContext);
  return context;
};

const inputGroupVariants = cva(
  'group/input-group relative flex w-full items-center transition-all outline-none',
  {
    variants: {
      variant: {
        filled:
          'border-0 hover:bg-neutral-hover has-[[data-slot=input-group-control]:focus]:bg-neutral-hover',
      },
      size: {
        sm: 'min-h-10 min-w-0 px-5 has-[>textarea]:h-auto rounded-3xl gap-1',
        md: 'min-h-12 min-w-0 px-6 has-[>textarea]:h-auto rounded-[32px] gap-1.5',
        lg: 'min-h-14 min-w-0 px-6 has-[>textarea]:h-auto rounded-[40px] gap-2',
      },
      colorScheme: {
        neutral: 'bg-neutral-base',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      colorScheme: 'neutral',
    },
  }
);

interface InputGroupProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof inputGroupVariants> {
  disabled?: boolean;
}

function InputGroup({
  className,
  variant = 'filled',
  size = 'md',
  colorScheme = 'neutral',
  disabled = false,
  ...props
}: InputGroupProps) {
  const contextValue: InputGroupContextValue = {
    variant: variant ?? 'filled',
    size: size ?? 'md',
    colorScheme: colorScheme ?? 'neutral',
    disabled,
  };

  return (
    <InputGroupContext.Provider value={contextValue}>
      <div
        data-slot='input-group'
        data-disabled={disabled}
        role='group'
        className={cn(
          inputGroupVariants({ variant, size, colorScheme }),
          // Error state.
          'has-[[data-slot][aria-invalid=true]]:ring-2 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive',
          // Disabled state.
          disabled && 'cursor-not-allowed',
          className
        )}
        {...props}
      />
    </InputGroupContext.Provider>
  );
}

const inputGroupAddonVariants = cva(
  'text-text-secondary flex h-auto cursor-text items-center justify-center gap-2 font-medium select-none group-data-[disabled=true]/input-group:opacity-50',
  {
    variants: {
      align: {
        'inline-start': "order-first [&>svg:not([class*='size-'])]:size-4",
        'inline-end': "order-last [&>svg:not([class*='size-'])]:size-4",
        'block-start':
          "order-first w-full justify-start [&>svg:not([class*='size-'])]:size-4",
        'block-end':
          "order-last w-full justify-start [&>svg:not([class*='size-'])]:size-4",
      },
      size: {
        sm: 'text-body-2',
        md: 'text-body-1',
        lg: 'text-body-1',
      },
    },
    defaultVariants: {
      align: 'inline-start',
      size: 'md',
    },
  }
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  const { size, disabled } = useInputGroupContext();
  return (
    <div
      role='group'
      data-slot='input-group-addon'
      data-align={align}
      className={cn(
        inputGroupAddonVariants({ align, size }),
        disabled && 'cursor-not-allowed',
        className
      )}
      onClick={e => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva('shadow-none flex gap-2 items-center', {
  variants: {
    size: {
      sm: "size-8 px-2.5 gap-1.5 text-body-2 [&>svg:not([class*='size-'])]:size-4",
      md: "size-9 px-3 gap-2 text-body-1 [&>svg:not([class*='size-'])]:size-4",
      lg: "size-10 px-3.5 gap-2 text-body-1 [&>svg:not([class*='size-'])]:size-5",
    },
    colorScheme: {
      neutral: 'text-text-secondary',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

function InputGroupButton({
  className,
  type = 'button',
  colorScheme: buttonColorScheme = 'neutral',
  size: buttonSize = 'md',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  const { size, colorScheme, disabled } = useInputGroupContext();
  return (
    <Button
      type={type}
      data-size={size}
      variant={'ghost'}
      colorScheme={colorScheme || buttonColorScheme}
      disabled={disabled}
      className={cn(
        inputGroupButtonVariants({
          size: size || buttonSize,
          colorScheme: colorScheme || buttonColorScheme,
        }),
        className
      )}
      {...props}
    />
  );
}

const inputGroupTextVariants = cva(
  "text-text-secondary flex items-center gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        sm: 'text-body-2',
        md: 'text-body-1',
        lg: 'text-body-1',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  const { size } = useInputGroupContext();
  return (
    <span
      className={cn(inputGroupTextVariants({ size }), className)}
      {...props}
    />
  );
}

const inputGroupInputVariants = cva(
  'flex-1 h-full px-0 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-text-secondary',
  {
    variants: {},
    defaultVariants: {},
  }
);

function InputGroupInput({
  className,
  ...props
}: Omit<React.ComponentProps<'input'>, 'size'>) {
  const { variant, size, colorScheme, disabled } = useInputGroupContext();
  return (
    <Input
      data-slot='input-group-control'
      className={cn(inputGroupInputVariants(), className)}
      variant={variant}
      size={size}
      colorScheme={colorScheme}
      disabled={disabled}
      {...props}
    />
  );
}

const inputGroupTextareaVariants = cva(
  'flex-1 px-0 resize-none rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0',
  {
    variants: {
      size: {
        sm: 'min-h-24 py-4 text-body-2',
        md: 'min-h-32 py-5 text-body-1',
        lg: 'min-h-40 py-5 text-body-1',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  const { variant, size, colorScheme, disabled } = useInputGroupContext();
  return (
    <Textarea
      data-slot='input-group-control'
      variant={variant}
      colorScheme={colorScheme}
      className={cn(inputGroupTextareaVariants({ size }), className)}
      disabled={disabled}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
