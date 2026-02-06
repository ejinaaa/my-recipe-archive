import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface SortButtonProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function SortButton({ onClick, isActive = false }: SortButtonProps) {
  return (
    <div className='relative'>
      <Button
        variant='solid'
        colorScheme='neutral'
        size='sm'
        onClick={onClick}
        aria-label='정렬'
      >
        <ArrowUpDown />
      </Button>
      {isActive && (
        <span className='absolute top-[3px] right-[3px] size-1.5 rounded-full bg-primary-light' />
      )}
    </div>
  );
}
