'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Clock, ImageOff, Pencil, UtensilsCrossed } from 'lucide-react';
import { BackButton } from '@/shared/ui/back-button';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import { ROUTES } from '@/shared/config';
import { useSuspenseRecipe } from '@/entities/recipe/api/hooks';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeCookingSteps } from './RecipeCookingSteps';

interface RecipeDetailPageProps {
  id: string;
}

/**
 * 레시피 상세 페이지 컴포넌트
 * id를 받아서 useSuspenseRecipe hook으로 데이터 조회
 */
export function RecipeDetailPage({ id }: RecipeDetailPageProps) {
  const router = useRouter();
  const { data: recipe } = useSuspenseRecipe(id);
  const [imageError, setImageError] = useState(false);

  if (!recipe) {
    notFound();
  }

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(ROUTES.RECIPES.EDIT(id));
  };

  const handleToggleFavorite = () => {
    // TODO: 즐겨찾기 기능 구현 시 추가
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className='relative min-h-screen bg-background'>
      {/* Fixed Header */}
      <div className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 py-2'>
        <BackButton onBack={handleBack} />
        <div className='flex items-center gap-2'>
          <Button
            variant='solid'
            colorScheme='neutral'
            size='sm'
            transparent
            className='size-10 p-0'
            onClick={handleEdit}
            aria-label='레시피 수정'
          >
            <Pencil className='size-5' />
          </Button>
          <FavoriteButton
            isFavorite={false}
            onToggle={handleToggleFavorite}
            size='sm'
          />
        </div>
      </div>

      {/* Thumbnail Section - 350px 고정 */}
      <div className='relative w-full h-[350px] overflow-hidden rounded-b-3xl'>
        {recipe.thumbnail_url && !imageError ? (
          <>
            <Image
              src={recipe.thumbnail_url}
              alt={recipe.title}
              fill
              priority
              className='object-cover'
              onError={handleImageError}
            />
            <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
          </>
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-neutral-active'>
            <ImageOff className='size-16 text-text-secondary' />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className='relative bg-background pt-6 px-4 pb-20 z-10'>
        {/* Badges */}
        <div className='flex flex-wrap gap-1.5 mb-4'>
          {recipe.cooking_time && (
            <Badge variant='solid' colorScheme='surface' size='sm' transparent>
              <Clock className='size-3' />
              {recipe.cooking_time}분
            </Badge>
          )}
          {recipe.servings && (
            <Badge variant='solid' colorScheme='surface' size='sm' transparent>
              <UtensilsCrossed className='size-3' />
              {recipe.servings}인분
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className='text-heading-2 font-bold mb-1 text-text-primary'>
          {recipe.title}
        </h1>

        {/* Description */}
        {recipe.description && (
          <p className='text-body-2 text-text-secondary leading-relaxed mb-14'>
            {recipe.description}
          </p>
        )}

        {/* Ingredients */}
        <RecipeIngredients ingredients={recipe.ingredients} />

        {/* Cooking Steps */}
        <RecipeCookingSteps steps={recipe.steps} />
      </div>
    </div>
  );
}
