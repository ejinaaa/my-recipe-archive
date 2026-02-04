import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface SortButtonProps {
  onClick?: () => void;
}

export function SortButton({ onClick }: SortButtonProps) {
  return (
    <Button
      variant='solid'
      colorScheme='neutral'
      size='sm'
      onClick={onClick}
      aria-label='정렬'
    >
      <ArrowUpDown />
    </Button>
  );
}
