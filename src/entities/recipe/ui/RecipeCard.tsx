import Link from 'next/link';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import { cn } from '@/shared/lib/utils';
import type { Recipe } from '../model/types';
import { RecipeThumbnailImage } from './RecipeThumbnailImage';
import { CookingTimeBadge } from './CookingTimeBadge';
import { ServingsBadge } from './ServingsBadge';

export interface RecipeCardProps {
  /** Recipe data */
  recipe: Pick<
    Recipe,
    | 'id'
    | 'title'
    | 'description'
    | 'thumbnail_url'
    | 'cooking_time'
    | 'servings'
  >;
  /** 레시피 상세 페이지 링크 */
  href: string;
  /** Whether the recipe is favorited */
  isFavorite?: boolean;
  /** Callback when favorite button is clicked */
  onToggleFavorite?: () => void;
  /** 추가 className */
  className?: string;
}

export function RecipeCard({
  recipe,
  href,
  isFavorite = false,
  onToggleFavorite,
  className,
}: RecipeCardProps) {
  const { title, description, thumbnail_url, cooking_time, servings } = recipe;

  return (
    <Link
      href={href}
      className={cn(
        'group relative block h-[240px] w-full max-w-[400px] overflow-hidden rounded-[20px]',
        'transition-transform duration-200',
        className,
      )}
    >
      {/* Background Image */}
      <div className='absolute inset-0'>
        <RecipeThumbnailImage
          src={thumbnail_url}
          alt={title}
          fill
          sizes='(max-width: 768px) 50vw, 400px'
          iconClassName='size-12'
        />
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
              {cooking_time && <CookingTimeBadge minutes={cooking_time} />}
              {servings && <ServingsBadge servings={servings} />}
            </div>
          )}

          {/* Title and Description */}
          <div className='flex flex-col gap-1'>
            <h3 className='text-body-1 text-white'>{title}</h3>
            {description && (
              <p className='text-caption text-white/90 line-clamp-3'>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
