import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface FilterButtonProps {
  onClick?: () => void;
  isActive?: boolean;
}

export function FilterButton({ onClick, isActive = false }: FilterButtonProps) {
  return (
    <div className='relative'>
      <Button
        variant='solid'
        colorScheme='neutral'
        size='sm'
        onClick={onClick}
        aria-label='필터'
      >
        <SlidersHorizontal />
      </Button>
      {isActive && (
        <span className='absolute top-[3px] right-[3px] size-1.5 rounded-full bg-primary-light' />
      )}
    </div>
  );
}
