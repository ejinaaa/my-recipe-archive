'use client';

import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { useImageError } from '@/shared/lib/useImageError';
import type { CookingStep } from '@/entities/recipe/model/types';

interface RecipeCookingStepsProps {
  steps: CookingStep[];
}

function StepImage({ imageUrl, step }: { imageUrl: string; step: number }) {
  const { hasError, handleError } = useImageError(imageUrl);

  if (hasError) {
    return (
      <div className='mb-3 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-neutral-base'>
        <ImageOff className='size-8 text-text-secondary' />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={`${step}단계`}
      width={400}
      height={300}
      className='mb-3 rounded-xl w-full object-cover'
      onError={handleError}
    />
  );
}

/**
 * 요리 순서 섹션 컴포넌트
 */
export function RecipeCookingSteps({ steps }: RecipeCookingStepsProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section className='mb-8'>
      <h2 className='text-heading-3 font-semibold mb-4 text-text-primary'>
        요리 순서
      </h2>
      <div className='space-y-6'>
        {steps.map(step => (
          <div key={step.step} className='flex gap-3'>
            <div className='flex-shrink-0 w-6 h-6 rounded-full bg-secondary-base text-white flex items-center justify-center text-caption font-bold mt-0.5'>
              {step.step}
            </div>
            <div className='flex-1'>
              {step.image_url && (
                <StepImage imageUrl={step.image_url} step={step.step} />
              )}
              <p className='text-body-2 text-text-primary leading-relaxed'>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
