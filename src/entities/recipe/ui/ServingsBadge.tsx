import { UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

interface ServingsBadgeProps {
  servings: number;
  /** 뱃지 색상 (기본: 'neutral') */
  colorScheme?: 'primary' | 'secondary' | 'neutral' | 'surface';
}

export function ServingsBadge({
  servings,
  colorScheme = 'neutral',
}: ServingsBadgeProps) {
  return (
    <Badge variant='solid' colorScheme={colorScheme} size='sm' transparent>
      <UtensilsCrossed className='size-3' />
      {servings}인분
    </Badge>
  );
}
