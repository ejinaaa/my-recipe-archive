'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, CookingPot, ImageOff } from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import { Badge } from '@/shared/ui/badge';
import { ROUTES } from '@/shared/config';
import type { Recipe } from '../model/types';

export interface RecipeCardHeroProps {
  /** 레시피 데이터 */
  recipe: Pick<
    Recipe,
    'id' | 'title' | 'description' | 'thumbnail_url' | 'cooking_time'
  >;
}

/**
 * 홈 Hero 섹션용 레시피 카드
 * 배경 이미지 + 좌측 그라데이션 오버레이
 */
export function RecipeCardHero({ recipe }: RecipeCardHeroProps) {
  const { id, title, description, thumbnail_url, cooking_time } = recipe;
  const {
    hasValidImage,
    hasError: imageError,
    handleError: handleImageError,
  } = useImageError(thumbnail_url);

  return (
    <Link
      href={ROUTES.RECIPES.DETAIL(id)}
      className='relative block w-full h-[200px] overflow-hidden rounded-3xl'
    >
      {/* 배경 이미지 */}
      <div className='absolute inset-0'>
        {hasValidImage ? (
          <Image
            src={thumbnail_url!}
            alt={title}
            fill
            priority
            sizes='(max-width: 768px) 100vw, 768px'
            className='object-cover'
            onError={handleImageError}
          />
        ) : imageError ? (
          <div className='flex h-full w-full items-center justify-center bg-neutral-base/30'>
            <ImageOff className='size-10 text-text-secondary' />
          </div>
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-neutral-base/30'>
            <CookingPot className='size-10 text-text-secondary' />
          </div>
        )}
      </div>

      {/* 좌측→우측 그라데이션 오버레이 */}
      <div className='absolute inset-0 bg-gradient-to-br from-surface from-30% via-surface/60 via-60% to-transparent' />

      {/* 조리시간 배지 */}
      {cooking_time && (
        <div className='absolute top-3 right-3'>
          <Badge variant='solid' colorScheme='neutral' size='sm' transparent>
            <Clock className='size-3' />
            {cooking_time}분
          </Badge>
        </div>
      )}

      {/* 콘텐츠 */}
      <div className='relative flex h-full w-[65%] flex-col justify-between p-4'>
        {/* 상단: 제목 + 설명 */}
        <div className='flex flex-col gap-1'>
          <h3 className='text-heading-3 text-text-primary'>
            오늘 {title} 요리 어때요?
          </h3>
          {description && (
            <p className='text-body-2 text-text-secondary line-clamp-3'>
              {description}
            </p>
          )}
        </div>

        {/* 하단: CTA 버튼 */}
        <div>
          <span className='inline-flex items-center gap-2.5 rounded-full bg-white/60 pl-5 pr-1.5 py-1.5 text-body-1 font-medium text-text-primary backdrop-blur-sm'>
            요리하러 가기
            <span className='flex items-center justify-center size-8 rounded-full bg-text-primary'>
              <ArrowRight className='size-4 text-white' />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
