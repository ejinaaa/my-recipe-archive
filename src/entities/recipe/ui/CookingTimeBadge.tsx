import { Clock } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

interface CookingTimeBadgeProps {
  minutes: number;
  /** 뱃지 색상 (기본: 'neutral') */
  colorScheme?: 'primary' | 'secondary' | 'neutral' | 'surface';
}

export function CookingTimeBadge({
  minutes,
  colorScheme = 'neutral',
}: CookingTimeBadgeProps) {
  return (
    <Badge variant='solid' colorScheme={colorScheme} size='sm' transparent>
      <Clock className='size-3' />
      {minutes}분
    </Badge>
  );
}
