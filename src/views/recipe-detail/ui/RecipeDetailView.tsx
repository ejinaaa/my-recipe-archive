'use client';

import * as React from 'react';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { BackButton } from '@/shared/ui/back-button';
import { Badge } from '@/shared/ui/badge';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import type { Recipe } from '@/entities/recipe/model/types';

interface RecipeDetailViewProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onBack?: () => void;
  onToggleFavorite?: () => void;
}

const RecipeDetailView = ({
  recipe,
  isFavorite = false,
  onBack,
  onToggleFavorite,
}: RecipeDetailViewProps) => {
  return (
    <div className='relative min-h-screen bg-background'>
      {/* Fixed Back & Favorite Buttons */}
      <div className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-4 py-2'>
        <BackButton onBack={onBack} />
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          size='sm'
        />
      </div>

      {/* Thumbnail Section */}
      <div className='relative w-full overflow-hidden rounded-b-3xl'>
        {recipe.thumbnail_url ? (
          <>
            {/* Thumbnail Image */}
            <img
              src={recipe.thumbnail_url}
              alt={recipe.title}
              className='w-full h-auto object-cover'
            />
            {/* Overlay Gradient */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
          </>
        ) : (
          <div className='w-full h-[320px] bg-gradient-to-b from-[#F0F0F0] to-[#E0E0E0]' />
        )}
      </div>

      {/* Content Section */}
      <div className='relative bg-background pt-6 px-4 pb-20 z-10'>
        <div className='flex flex-wrap gap-1.5 mb-4'>
          {/* Cooking Time & Servings Badges */}
          {recipe.cooking_time && (
            <Badge
              variant='solid'
              colorScheme='surface'
              size='sm'
              transparent={true}
            >
              <Clock className='size-3' />
              {recipe.cooking_time} min
            </Badge>
          )}
          {recipe.servings && (
            <Badge
              variant='solid'
              colorScheme='surface'
              size='sm'
              transparent={true}
            >
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

        {/* Ingredients Section */}
        {recipe.ingredients.length > 0 && (
          <section className='mb-14'>
            <h2 className='text-heading-3 font-semibold mb-4 text-text-primary'>
              재료
            </h2>
            <div className=''>
              <ul className='space-y-3'>
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2 text-body-2'
                  >
                    <Badge
                      variant='outline'
                      colorScheme='neutral'
                      size='md'
                      transparent={true}
                    >
                      {ingredient.name} {ingredient.amount} {ingredient.unit}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Cooking Steps Section */}
        {recipe.steps.length > 0 && (
          <section className='mb-8'>
            <h2 className='text-heading-3 font-semibold mb-4 text-text-primary'>
              요리 순서
            </h2>
            <div className='space-y-6'>
              {recipe.steps.map(step => (
                <div key={step.step} className='flex gap-3 '>
                  <div className='flex-shrink-0 w-6 h-6 rounded-full bg-secondary-base text-white flex items-center justify-center text-caption font-bold mt-0.5'>
                    {step.step}
                  </div>

                  <div className='flex-1'>
                    {step.image_url && (
                      <img
                        src={step.image_url}
                        alt={`Step ${step.step}`}
                        className='mb-3 rounded-xl w-full object-cover'
                      />
                    )}

                    <p className='text-body-2 text-text-primary leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

RecipeDetailView.displayName = 'RecipeDetailView';

export { RecipeDetailView };
export type { RecipeDetailViewProps };
