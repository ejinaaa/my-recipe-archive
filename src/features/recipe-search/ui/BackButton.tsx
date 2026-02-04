import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface BackButtonProps {
  onClick?: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      variant='solid'
      colorScheme='neutral'
      size='sm'
      onClick={onClick}
      aria-label='뒤로 가기'
    >
      <ChevronLeft />
    </Button>
  );
}
