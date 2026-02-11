import * as React from 'react';
import { Heart } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/shared/lib/utils';

export interface FavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the item is favorited */
  isFavorite?: boolean;
  /** Callback when favorite button is clicked */
  onToggle?: () => void;
  /** Button size variant */
  size?: 'sm' | 'md';
}

const FavoriteButton = React.forwardRef<HTMLButtonElement, FavoriteButtonProps>(
  (
    { isFavorite = false, onToggle, size = 'sm', className, onClick, ...props },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClick?.(e);
      onToggle?.();
    };

    return (
      <Button
        ref={ref}
        variant='solid'
        colorScheme='neutral'
        size={size}
        transparent={true}
        onClick={handleClick}
        className={cn('shrink-0', isFavorite && 'text-primary-base', className)}
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        {...props}
      >
        <Heart className={cn('size-5', isFavorite && 'fill-current')} />
      </Button>
    );
  }
);

FavoriteButton.displayName = 'FavoriteButton';

export { FavoriteButton };
