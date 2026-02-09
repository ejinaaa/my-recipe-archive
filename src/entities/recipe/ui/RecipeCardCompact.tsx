'use client';

import Image from 'next/image';
import { Clock, CookingPot, ImageOff } from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import { Badge } from '@/shared/ui/badge';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import { cn } from '@/shared/lib/utils';
import type { Recipe } from '../model/types';

export interface RecipeCardCompactProps {
  /** 레시피 데이터 */
  recipe: Pick<Recipe, 'id' | 'title' | 'thumbnail_url' | 'cooking_time'>;
  /** 즐겨찾기 여부 */
  isFavorite?: boolean;
  /** 즐겨찾기 토글 핸들러 */
  onToggleFavorite?: () => void;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 className */
  className?: string;
}

/**
 * 수평 스크롤 섹션용 컴팩트 레시피 카드
 */
export function RecipeCardCompact({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  className,
}: RecipeCardCompactProps) {
  const { title, thumbnail_url, cooking_time } = recipe;
  const { hasValidImage, hasError: imageError, handleError: handleImageError } = useImageError(thumbnail_url);

  return (
    <div
      className={cn(
        'relative h-[120px] w-[160px] flex-shrink-0 overflow-hidden rounded-3xl cursor-pointer',
        'transition-transform duration-200',
        className,
      )}
      onClick={onClick}
    >
      {/* 배경 이미지 */}
      <div className='absolute inset-0'>
        {hasValidImage ? (
          <Image
            src={thumbnail_url!}
            alt={title}
            width={160}
            height={120}
            className='h-full w-full object-cover'
            onError={handleImageError}
          />
        ) : imageError ? (
          <div className='flex h-full w-full items-center justify-center bg-neutral-base'>
            <ImageOff className='size-10 text-text-secondary' />
          </div>
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-neutral-base'>
            <CookingPot className='size-10 text-text-secondary' />
          </div>
        )}
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
          {cooking_time && (
            <div>
              <Badge
                variant='solid'
                colorScheme='neutral'
                size='sm'
                transparent
              >
                <Clock className='size-3' />
                {cooking_time}분
              </Badge>
            </div>
          )}
          <h3 className='text-body-2 text-white line-clamp-1 font-medium'>
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
