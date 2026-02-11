import Link from 'next/link';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import { cn } from '@/shared/lib/utils';
import type { Recipe } from '../model/types';
import { RecipeThumbnailImage } from './RecipeThumbnailImage';
import { CookingTimeBadge } from './CookingTimeBadge';

export interface RecipeCardCompactProps {
  /** 레시피 데이터 */
  recipe: Pick<Recipe, 'id' | 'title' | 'thumbnail_url' | 'cooking_time'>;
  /** 레시피 상세 페이지 링크 */
  href: string;
  /** 즐겨찾기 여부 */
  isFavorite?: boolean;
  /** 즐겨찾기 토글 핸들러 */
  onToggleFavorite?: () => void;
  /** 추가 className */
  className?: string;
}

/**
 * 수평 스크롤 섹션용 컴팩트 레시피 카드
 */
export function RecipeCardCompact({
  recipe,
  href,
  isFavorite = false,
  onToggleFavorite,
  className,
}: RecipeCardCompactProps) {
  const { title, thumbnail_url, cooking_time } = recipe;

  return (
    <Link
      href={href}
      className={cn(
        'relative block h-[120px] w-[160px] flex-shrink-0 overflow-hidden rounded-3xl',
        'transition-transform duration-200',
        className,
      )}
    >
      {/* 배경 이미지 */}
      <div className='absolute inset-0'>
        <RecipeThumbnailImage
          src={thumbnail_url}
          alt={title}
          width={160}
          height={120}
          imageClassName='h-full w-full object-cover'
        />
      </div>

      {/* 그라디언트 오버레이 */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />

      {/* 콘텐츠 */}
      <div className='relative flex h-full flex-col justify-between p-2'>
        {/* 상단: 즐겨찾기 버튼 */}
        <div className='flex items-start justify-end'>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            size='sm'
          />
        </div>

        {/* 하단: 배지 + 제목 */}
        <div className='flex flex-col gap-1'>
          <div>
            {cooking_time && <CookingTimeBadge minutes={cooking_time} />}
          </div>
          <h3 className='text-body-2 text-white line-clamp-2 font-medium'>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
