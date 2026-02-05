import * as React from 'react';
import { Clock, ImageOff, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { FavoriteButton } from '@/shared/ui/favorite-button';
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
    ref,
  ) => {
    const { title, description, thumbnail_url, cooking_time, servings } =
      recipe;

    const [imageError, setImageError] = React.useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'group relative h-[240px] w-full max-w-[400px] overflow-hidden rounded-[20px] cursor-pointer',
          'transition-transform duration-200',
          className,
        )}
        onClick={onClick}
        {...props}
      >
        {/* Background Image */}
        <div className='absolute inset-0'>
          {thumbnail_url && !imageError ? (
            <img
              src={thumbnail_url}
              alt={title}
              className='h-full w-full object-cover'
              onError={handleImageError}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-neutral-base'>
              <ImageOff className='size-12 text-text-secondary' />
            </div>
          )}
        </div>

        {/* Gradient Overlay for text readability */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />

        {/* Content Container */}
        <div className='relative flex h-full flex-col justify-between pl-2 pr-1.5 pt-1.5 pb-4'>
          {/* Top Section: Favorite Button */}
          <div className='flex items-start justify-end'>
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
            />
          </div>

          {/* Bottom Section: Badges, Title and Description */}
          <div className='flex flex-col gap-1.5'>
            {/* Badges */}
            {(cooking_time || servings) && (
              <div className='flex flex-wrap gap-1'>
                {cooking_time && (
                  <Badge
                    variant='solid'
                    colorScheme='neutral'
                    size='sm'
                    transparent={true}
                  >
                    <Clock className='size-3' />
                    {cooking_time}분
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
              <h3 className='text-body-1 text-white line-clamp-2'>{title}</h3>
              {description && (
                <p className='text-caption text-white/90 line-clamp-1'>
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

RecipeCard.displayName = 'RecipeCard';

export { RecipeCard };
