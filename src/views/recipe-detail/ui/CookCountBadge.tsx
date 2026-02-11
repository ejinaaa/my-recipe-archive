import { ChefHat } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

interface CookCountBadgeProps {
  count: number;
}

export function CookCountBadge({ count }: CookCountBadgeProps) {
  return (
    <Badge variant='solid' colorScheme='secondary' size='sm' transparent>
      <ChefHat className='size-3' />
      {count > 0 ? `${count}번 요리했어요` : '첫 도전을 기다리는 중'}
    </Badge>
  );
}
