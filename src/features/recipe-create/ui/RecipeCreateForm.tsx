'use client';

import { Plus, Trash2, CookingPot, Camera } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { Slider } from '@/shared/ui/slider';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/lib/utils';
import { useRecipeForm, type RecipeFormData } from '../model/hooks';
import type { RecipeCategory } from '@/entities/recipe/model/types';
import type { CategoryGroup } from '@/entities/category/model/types';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
  COOKING_TIME_STEP,
} from '@/entities/recipe/model/constants';
import { formatCookingTime } from '@/entities/recipe/model/utils';

interface RecipeCreateFormProps {
  /** 카테고리 그룹 목록 */
  categoryGroups: CategoryGroup[];
  /** 폼 제출 핸들러 */
  onSubmit: (data: RecipeFormData) => Promise<void>;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 레시피 생성 폼 컴포넌트
 */
export function RecipeCreateForm({
  categoryGroups,
  onSubmit,
  className,
}: RecipeCreateFormProps) {
  const {
    formData,
    isSubmitting,
    isValid,
    updateField,
    toggleCategory,
    updateIngredient,
    insertIngredientAt,
    removeIngredient,
    updateStep,
    insertStepAt,
    removeStep,
    handleSubmit,
  } = useRecipeForm({ onSubmit });

  const isDisabled = isSubmitting;

  return (
    <div className={cn('flex flex-col gap-6 pb-6', className)}>
      {/* 썸네일 이미지 영역 (플레이스홀더) */}
      <section className='flex flex-col items-center gap-2'>
        <div className='relative size-24 rounded-full bg-neutral-base flex items-center justify-center'>
          <CookingPot className='size-8 text-text-secondary/60' />
          <div className='absolute -bottom-1 -right-1 size-8 rounded-full bg-white border border-neutral-base flex items-center justify-center'>
            <Camera className='size-4 text-text-secondary' />
          </div>
        </div>
        <span className='text-caption text-text-secondary'>
          곧 이미지를 추가할 수 있어요
        </span>
      </section>

      {/* 제목 */}
      <section className='flex flex-col gap-2'>
        <Label className='text-body-2 text-text-primary font-medium'>
          요리 이름 <span className='text-primary-base'>*</span>
        </Label>
        <Input
          placeholder='맛있는 요리 이름을 알려주세요'
          value={formData.title}
          onChange={e => updateField('title', e.target.value)}
          maxLength={30}
          disabled={isDisabled}
          size='sm'
        />
        <span className='text-caption text-text-secondary text-right'>
          {formData.title.length}/30
        </span>
      </section>

      {/* 설명 */}
      <section className='flex flex-col gap-2'>
        <Label className='text-body-2 text-text-primary font-medium'>
          요리 소개
        </Label>
        <Textarea
          placeholder='이 요리의 매력을 소개해 주세요'
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          disabled={isDisabled}
          size='sm'
        />
      </section>

      {/* 인분 */}
      <section className='flex flex-col gap-2'>
        <Label className='text-body-2 text-text-primary font-medium'>
          몇 인분 <span className='text-primary-base'>*</span>
        </Label>
        <Slider
          size='sm'
          value={formData.servings}
          onValueChange={value =>
            updateField('servings', Array.isArray(value) ? value[0] : value)
          }
          min={1}
          max={10}
          step={1}
          valueDisplay={`${formData.servings}인분`}
          disabled={isDisabled}
        />
      </section>

      {/* 조리 시간 */}
      <section className='flex flex-col gap-2'>
        <Label className='text-body-2 text-text-primary font-medium'>
          만드는 시간 <span className='text-primary-base'>*</span>
        </Label>
        <Slider
          size='sm'
          value={formData.cooking_time}
          onValueChange={value =>
            updateField('cooking_time', Array.isArray(value) ? value[0] : value)
          }
          min={COOKING_TIME_MIN}
          max={COOKING_TIME_MAX}
          step={COOKING_TIME_STEP}
          valueDisplay={formatCookingTime(formData.cooking_time)}
          disabled={isDisabled}
        />
      </section>

      {/* 카테고리 선택 */}
      {categoryGroups.map(group => (
        <section key={group.type} className='flex flex-col gap-3'>
          <Label className='text-body-2 text-text-primary font-medium'>
            {CATEGORY_TYPE_LABELS[group.type]}{' '}
            <span className='text-primary-base'>*</span>
          </Label>
          <div className='flex flex-wrap gap-2'>
            {group.options.map(option => {
              const isSelected =
                formData.categories[option.type]?.code === option.code;
              const category: RecipeCategory = {
                type: option.type,
                code: option.code,
                name: option.name,
              } as RecipeCategory;

              return (
                <Badge
                  key={`${option.type}-${option.code}`}
                  variant='outline'
                  colorScheme='neutral'
                  selected={isSelected}
                  onClick={() => !isDisabled && toggleCategory(category)}
                  className={cn(
                    'cursor-pointer select-none',
                    isDisabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {option.icon}
                  {option.name}
                </Badge>
              );
            })}
          </div>
        </section>
      ))}

      {/* 재료 */}
      <section className='flex flex-col gap-3'>
        <Label className='text-body-2 text-text-primary font-medium'>
          필요한 재료 <span className='text-primary-base'>*</span>
        </Label>
        <div className='flex flex-col gap-3'>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className='flex gap-2 items-center'>
              {/* 재료명 */}
              <Input
                size='sm'
                placeholder='감자'
                value={ingredient.name}
                onChange={e => updateIngredient(index, 'name', e.target.value)}
                disabled={isDisabled}
                className='flex-1'
              />
              {/* 분량 */}
              <Input
                size='sm'
                placeholder='2'
                value={ingredient.amount}
                onChange={e =>
                  updateIngredient(index, 'amount', e.target.value)
                }
                disabled={isDisabled}
                className='w-16'
              />
              {/* 단위 */}
              <Input
                size='sm'
                placeholder='개'
                value={ingredient.unit || ''}
                onChange={e => updateIngredient(index, 'unit', e.target.value)}
                disabled={isDisabled}
                className='w-16'
              />
              <Button
                type='button'
                variant='solid'
                colorScheme='neutral'
                size='sm'
                onClick={() => insertIngredientAt(index)}
                disabled={isDisabled}
                className='size-10 p-0 shrink-0'
              >
                <Plus className='size-4' />
              </Button>
              <Button
                type='button'
                variant='solid'
                colorScheme='neutral'
                size='sm'
                onClick={() => removeIngredient(index)}
                disabled={isDisabled || formData.ingredients.length <= 1}
                className='size-10 p-0 shrink-0'
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 조리 단계 */}
      <section className='flex flex-col gap-3'>
        <Label className='text-body-2 text-text-primary font-medium'>
          만드는 순서 <span className='text-primary-base'>*</span>
        </Label>
        <div className='flex flex-col gap-3'>
          {formData.steps.map((step, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <div className='shrink-0 size-8 rounded-full bg-secondary-base text-white flex items-center justify-center text-body-2 font-medium mt-2'>
                {step.step}
              </div>
              <Textarea
                placeholder={`${step.step}단계에서 할 일을 알려주세요`}
                value={step.description}
                onChange={e => updateStep(index, e.target.value)}
                disabled={isDisabled}
                className='flex-1 min-h-20'
                size='sm'
              />
              <Button
                type='button'
                variant='solid'
                colorScheme='neutral'
                size='sm'
                onClick={() => insertStepAt(index)}
                disabled={isDisabled}
                className='size-10 p-0 shrink-0 mt-2'
              >
                <Plus className='size-4' />
              </Button>
              <Button
                type='button'
                variant='solid'
                colorScheme='neutral'
                size='sm'
                onClick={() => removeStep(index)}
                disabled={isDisabled || formData.steps.length <= 1}
                className='size-10 p-0 shrink-0 mt-2'
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* 제출 버튼 */}
      <Button
        type='button'
        variant='solid'
        colorScheme='primary'
        size='lg'
        onClick={handleSubmit}
        disabled={!isValid || isDisabled}
        className='w-full mt-4'
      >
        {isSubmitting ? '레시피 만드는 중...' : '나만의 레시피 완성!'}
      </Button>
    </div>
  );
}
