import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './button';

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Callback when button is clicked */
  onBack?: () => void;
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ onBack, onClick, className, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onBack?.();
    };

    return (
      <Button
        ref={ref}
        variant='solid'
        colorScheme='neutral'
        size='sm'
        transparent={true}
        onClick={handleClick}
        className={className}
        aria-label='뒤로 가기'
        {...props}
      >
        <ChevronLeft className='size-5' />
      </Button>
    );
  }
);

BackButton.displayName = 'BackButton';

export { BackButton };
