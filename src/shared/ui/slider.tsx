'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const sliderVariants = cva('', {
  variants: {
    colorScheme: {
      primary: '',
      secondary: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    colorScheme: 'primary',
    size: 'md',
  },
});

const sliderTrackVariants = cva(
  'bg-neutral-base relative grow overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1',
        md: 'data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5',
        lg: 'data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const sliderRangeVariants = cva(
  'absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
  {
    variants: {
      colorScheme: {
        primary: 'bg-primary-base',
        secondary: 'bg-secondary-base',
      },
    },
    defaultVariants: {
      colorScheme: 'primary',
    },
  },
);

const sliderThumbVariants = cva(
  'block shrink-0 rounded-full bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      colorScheme: {
        primary: 'bg-text-primary',
        secondary: 'bg-text-primary',
      },
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
      },
    },
    defaultVariants: {
      colorScheme: 'primary',
      size: 'md',
    },
  },
);

export interface SliderProps
  extends
    Omit<
      React.ComponentProps<typeof SliderPrimitive.Root>,
      'defaultValue' | 'value' | 'onValueChange'
    >,
    VariantProps<typeof sliderVariants> {
  value?: number | number[];
  onValueChange?: (value: number | number[]) => void;
  defaultValue?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  /** 라벨 우측에 표시할 값 텍스트 */
  valueDisplay?: string;
}

function Slider({
  className,
  colorScheme = 'primary',
  size = 'md',
  defaultValue,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  valueDisplay,
  ...props
}: SliderProps) {
  // value를 항상 배열로 변환
  const arrayValue = React.useMemo(() => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [min];
  }, [value, defaultValue, min]);

  // 단일 값인 경우 단일 값으로, 배열인 경우 배열로 반환
  const handleValueChange = (newValue: number[]) => {
    if (!onValueChange) return;

    if (Array.isArray(value) || Array.isArray(defaultValue)) {
      onValueChange(newValue);
    } else {
      onValueChange(newValue[0]);
    }
  };

  return (
    <div className='w-full space-y-2'>
      {(label || valueDisplay) && (
        <div className='flex items-center justify-between text-body-2'>
          {label && <span className='text-text-primary font-medium'>{label}</span>}
          {valueDisplay && (
            <span className='text-text-secondary font-medium'>{valueDisplay}</span>
          )}
        </div>
      )}
      <SliderPrimitive.Root
        data-slot='slider'
        defaultValue={
          defaultValue !== undefined
            ? Array.isArray(defaultValue)
              ? defaultValue
              : [defaultValue]
            : undefined
        }
        value={arrayValue}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className={cn(
          'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          sliderVariants({ colorScheme, size }),
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot='slider-track'
          className={cn(
            sliderTrackVariants({ size }),
            'data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full',
          )}
        >
          <SliderPrimitive.Range
            data-slot='slider-range'
            className={cn(sliderRangeVariants({ colorScheme }))}
          />
        </SliderPrimitive.Track>
        {arrayValue.map((_, index) => (
          <SliderPrimitive.Thumb
            data-slot='slider-thumb'
            key={index}
            className={cn(sliderThumbVariants({ colorScheme, size }))}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider, sliderVariants };
