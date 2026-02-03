import * as React from 'react';
import { Clock, UtensilsCrossed, Heart } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import type { Recipe } from '../model/types';

export interface RecipeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Recipe data */
  recipe: Pick<
    Recipe,
    'title' | 'description' | 'thumbnail_url' | 'cooking_time' | 'servings'
  >;
  /** Whether the recipe is favorited */
  isFavorite?: boolean;
  /** Callback when favorite button is clicked */
  onToggleFavorite?: () => void;
}

const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  (
    {
      recipe,
      isFavorite = false,
      onToggleFavorite,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const { title, description, thumbnail_url, cooking_time, servings } =
      recipe;

    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'group relative h-[280px] w-full max-w-[400px] overflow-hidden rounded-[20px] cursor-pointer',
          'transition-transform duration-200 hover:scale-[1.02]',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {/* Background Image */}
        <div className='absolute inset-0'>
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={title}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='h-full w-full bg-neutral-base' />
          )}
        </div>

        {/* Gradient Overlay for text readability */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />

        {/* Content Container */}
        <div className='relative flex h-full flex-col justify-between p-4'>
          {/* Top Section: Favorite Button */}
          <div className='flex items-start justify-end'>
            <Button
              variant='solid'
              colorScheme='neutral'
              size='sm'
              transparent={true}
              onClick={handleFavoriteClick}
              className={cn(
                'shrink-0 hover:scale-110',
                isFavorite && 'text-primary-base'
              )}
              aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            >
              <Heart className={cn('size-5', isFavorite && 'fill-current')} />
            </Button>
          </div>

          {/* Bottom Section: Badges, Title and Description */}
          <div className='flex flex-col gap-2'>
            {/* Badges */}
            {(cooking_time || servings) && (
              <div className='flex flex-wrap gap-2'>
                {cooking_time && (
                  <Badge
                    variant='solid'
                    colorScheme='neutral'
                    size='sm'
                    transparent={true}
                  >
                    <Clock className='size-3' />
                    {cooking_time} min
                  </Badge>
                )}
                {servings && (
                  <Badge
                    variant='solid'
                    colorScheme='neutral'
                    size='sm'
                    transparent={true}
                  >
                    <UtensilsCrossed className='size-3' />
                    {servings}인분
                  </Badge>
                )}
              </div>
            )}

            {/* Title and Description */}
            <div className='flex flex-col gap-1'>
              <h3 className='text-heading-3 text-white line-clamp-2'>
                {title}
              </h3>
              {description && (
                <p className='text-body-2 text-white/90 line-clamp-1'>
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RecipeCard.displayName = 'RecipeCard';

export { RecipeCard };
