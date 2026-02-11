'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import {
  Check,
  ChefHat,
  Clock,
  CookingPot,
  ImageOff,
  Loader2,
  Pencil,
  UtensilsCrossed,
} from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import { useCurrentProfile } from '@/entities/user/api/hooks';
import {
  useCookCount,
  useAddCookingLog,
} from '@/entities/cooking-log/api/hooks';
import {
  useIsFavorited,
  useToggleFavorite,
} from '@/entities/favorite/api/hooks';
import { BackButton } from '@/shared/ui/back-button';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import { ROUTES } from '@/shared/config';
import {
  useSuspenseRecipe,
  useIncrementViewCount,
} from '@/entities/recipe/api/hooks';
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
  const { hasValidImage: hasThumbImage, hasError: thumbImageError, handleError: handleImageError } = useImageError(recipe?.thumbnail_url);
  const { data: profile } = useCurrentProfile();
  const userId = profile?.id;
  const { data: cookCount } = useCookCount(userId, id);
  const addCookingLog = useAddCookingLog();
  const incrementViewCount = useIncrementViewCount();
  const { data: isFavorited } = useIsFavorited(userId, id);
  const toggleFavorite = useToggleFavorite();
  const [showSuccess, setShowSuccess] = useState(false);

  // 페이지 진입 시 조회수 증가
  useEffect(() => {
    if (userId) {
      incrementViewCount.mutate({ recipeId: id, userId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

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
    if (!userId) return;
    toggleFavorite.mutate({ userId, recipeId: id });
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
            isFavorite={isFavorited ?? false}
            onToggle={handleToggleFavorite}
            size='sm'
          />
        </div>
      </div>

      {/* Thumbnail Section - 350px 고정 */}
      <div className='relative w-full h-[350px] overflow-hidden rounded-b-3xl'>
        {hasThumbImage ? (
          <>
            <Image
              src={recipe.thumbnail_url!}
              alt={recipe.title}
              fill
              priority
              className='object-cover'
              onError={handleImageError}
            />
            <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
          </>
        ) : thumbImageError ? (
          <div className='flex h-full w-full items-center justify-center bg-neutral-active'>
            <ImageOff className='size-16 text-text-secondary' />
          </div>
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-neutral-active'>
            <CookingPot className='size-16 text-text-secondary' />
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
          {cookCount && cookCount > 0 ? (
            <Badge
              variant='solid'
              colorScheme='secondary'
              size='sm'
              transparent
            >
              <ChefHat className='size-3' />
              {cookCount}번 요리했어요
            </Badge>
          ) : (
            <Badge
              variant='solid'
              colorScheme='secondary'
              size='sm'
              transparent
            >
              <ChefHat className='size-3' />첫 도전을 기다리는 중
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

        {/* 요리 완료 버튼 */}
        {userId && (
          <div className='mt-14'>
            {showSuccess ? (
              <Button
                variant='solid'
                colorScheme='secondary'
                className='w-full animate-in zoom-in-95 duration-300'
              >
                <Check className='size-5' />
                오늘도 수고했어요!
              </Button>
            ) : (
              <Button
                variant='solid'
                colorScheme='primary'
                className='w-full'
                disabled={addCookingLog.isPending}
                onClick={() =>
                  addCookingLog.mutate(
                    { userId, recipeId: id },
                    { onSuccess: () => setShowSuccess(true) },
                  )
                }
              >
                {addCookingLog.isPending ? (
                  <>
                    <Loader2 className='size-5 animate-spin' />
                    기록하는 중...
                  </>
                ) : (
                  <>
                    <ChefHat className='size-5' />
                    요리 완료!
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
