import Image from 'next/image';
import type { CookingStep } from '@/entities/recipe/model/types';

interface RecipeCookingStepsProps {
  steps: CookingStep[];
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
                <Image
                  src={step.image_url}
                  alt={`${step.step}단계`}
                  width={400}
                  height={300}
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
  );
}
