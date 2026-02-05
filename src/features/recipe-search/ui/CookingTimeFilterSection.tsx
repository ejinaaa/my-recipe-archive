'use client';

import { Slider } from '@/shared/ui/slider';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
  COOKING_TIME_STEP,
} from '@/entities/recipe/model/constants';
import { formatCookingTime } from '@/entities/recipe/model/utils';

interface CookingTimeFilterSectionProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function CookingTimeFilterSection({
  value,
  onChange,
}: CookingTimeFilterSectionProps) {
  const displayValue = `${formatCookingTime(value[0])} ~ ${formatCookingTime(value[1])}`;

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-heading-3 text-text-primary'>만드는 시간</h3>
        <span className='text-body-2 text-text-secondary'>{displayValue}</span>
      </div>
      <div className='px-1'>
        <Slider
          value={value}
          onValueChange={v => onChange(v as [number, number])}
          min={COOKING_TIME_MIN}
          max={COOKING_TIME_MAX}
          step={COOKING_TIME_STEP}
          colorScheme='primary'
          size={'sm'}
        />
      </div>
    </section>
  );
}
