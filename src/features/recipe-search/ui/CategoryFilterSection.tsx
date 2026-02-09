'use client';

import { Badge } from '@/shared/ui/badge';
import type {
  CategoryOption,
  CategoryType,
} from '@/entities/category/model/types';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';

interface CategoryFilterSectionProps {
  type: CategoryType;
  options: CategoryOption[];
  selectedCodes: string[];
  onToggle: (code: string) => void;
}

export function CategoryFilterSection({
  type,
  options,
  selectedCodes,
  onToggle,
}: CategoryFilterSectionProps) {
  const title = CATEGORY_TYPE_LABELS[type];

  return (
    <section className='space-y-3'>
      <h3 className='text-heading-3 text-text-primary'>{title}</h3>
      <div className='flex flex-wrap gap-2'>
        {options.map(option => {
          const isSelected = selectedCodes.includes(option.code);
          return (
            <Badge
              key={option.id}
              variant='outline'
              colorScheme='neutral'
              size='md'
              selected={isSelected}
              onClick={() => onToggle(option.code)}
            >
              {option.icon}
              {option.name}
            </Badge>
          );
        })}
      </div>
    </section>
  );
}
