'use client';

import { notFound, useRouter } from 'next/navigation';
import { useCookCountQuery } from '@/entities/cooking-log/api/hooks';
import { useCurrentProfileQuery } from '@/entities/user/api/hooks';
import {
  useIsFavoritedQuery,
  useToggleFavoriteMutation,
} from '@/entities/favorite/api/hooks';
import { BackButton } from '@/shared/ui/back-button';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import { PageContent } from '@/shared/ui/page-content';
import { PageHeader } from '@/shared/ui/page-header';
import { useSuspenseRecipeQuery } from '@/entities/recipe/api/hooks';
import { useTrackViewCount } from './useTrackViewCount';
import { CookCountBadge } from './CookCountBadge';
import { CookingTimeBadge } from '@/entities/recipe/ui/CookingTimeBadge';
import { ServingsBadge } from '@/entities/recipe/ui/ServingsBadge';
import { CookingCompleteButton } from './CookingCompleteButton';
import { EditButton } from './EditButton';
import { RecipeThumbnail } from './RecipeThumbnail';
import { RecipeIngredients } from './RecipeIngredients';
import { RecipeCookingSteps } from './RecipeCookingSteps';

interface RecipeDetailPageProps {
  id: string;
}

/**
 * 레시피 상세 페이지 컴포넌트
 * id를 받아서 useSuspenseRecipeQuery hook으로 데이터 조회
 */
export function RecipeDetailPage({ id }: RecipeDetailPageProps) {
  const router = useRouter();
  const { data: recipe } = useSuspenseRecipeQuery(id);
  const { data: profile } = useCurrentProfileQuery();
  const userId = profile?.id;
  const { data: cookCount } = useCookCountQuery(userId, id);
  const { data: isFavorited } = useIsFavoritedQuery(userId, id);
  const toggleFavorite = useToggleFavoriteMutation();

  useTrackViewCount(id, userId);

  if (!recipe) {
    notFound();
  }

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = () => {
    if (!userId) return;
    toggleFavorite.mutate({ userId, recipeId: id });
  };

  return (
    <div className='relative min-h-screen bg-background'>
      {/* Fixed Header */}
      <PageHeader className='fixed top-0 left-0 right-0 z-50'>
        <BackButton onBack={handleBack} />
        <div className='flex items-center gap-2'>
          <EditButton recipeId={id} />
          <FavoriteButton
            isFavorite={isFavorited ?? false}
            onToggle={handleToggleFavorite}
            size='sm'
          />
        </div>
      </PageHeader>

      {/* Thumbnail Section - 350px 고정 */}
      <RecipeThumbnail
        thumbnailUrl={recipe.thumbnail_url}
        title={recipe.title}
        className='h-[350px]'
      />

      {/* Content Section */}
      <PageContent className='relative bg-background pt-6 px-5 pb-20 z-10'>
        {/* Badges */}
        <div className='flex flex-wrap gap-1.5 mb-4'>
          {recipe.cooking_time && (
            <CookingTimeBadge
              minutes={recipe.cooking_time}
              colorScheme='surface'
            />
          )}
          {recipe.servings && (
            <ServingsBadge servings={recipe.servings} colorScheme='surface' />
          )}
          {cookCount !== undefined && <CookCountBadge count={cookCount} />}
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
            <CookingCompleteButton userId={userId} recipeId={id} />
          </div>
        )}
      </PageContent>
    </div>
  );
}
