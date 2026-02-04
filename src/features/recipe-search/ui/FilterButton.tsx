import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface FilterButtonProps {
  onClick?: () => void;
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <Button
      variant='solid'
      colorScheme='neutral'
      size='sm'
      onClick={onClick}
      aria-label='필터'
    >
      <SlidersHorizontal />
    </Button>
  );
}
