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

/**
 * 카테고리 타입별 한글 레이블
 */
const categoryTypeLabels: Record<string, string> = {
  situation: '상황별',
  cuisine: '장르/나라별',
  dishType: '요리 종류별',
};

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
    <div className={cn('flex flex-col gap-6 pb-8', className)}>
      {/* 썸네일 이미지 영역 (플레이스홀더) */}
      <section className='flex flex-col items-center gap-2'>
        <div className='relative size-24 rounded-full bg-neutral-base flex items-center justify-center'>
          <CookingPot className='size-8 text-text-secondary/60' />
          <div className='absolute -bottom-1 -right-1 size-8 rounded-full bg-white border border-neutral-base flex items-center justify-center'>
            <Camera className='size-4 text-text-secondary' />
          </div>
        </div>
        <span className='text-caption text-text-secondary'>
          이미지 추가 기능은 준비 중입니다
        </span>
      </section>

      {/* 제목 */}
      <section className='flex flex-col gap-2'>
        <Label className='text-caption text-text-secondary'>
          제목 <span className='text-primary-base'>*</span>
        </Label>
        <Input
          placeholder='레시피 제목을 입력하세요'
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
        <Label className='text-caption text-text-secondary'>설명</Label>
        <Textarea
          placeholder='레시피에 대한 간단한 설명을 입력하세요'
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          disabled={isDisabled}
          size='sm'
        />
      </section>

      {/* 인분 */}
      <section className='flex flex-col gap-2'>
        <Slider
          size='sm'
          label='인분'
          value={formData.servings}
          onValueChange={value =>
            updateField('servings', Array.isArray(value) ? value[0] : value)
          }
          min={1}
          max={10}
          step={1}
          unit='인분'
          disabled={isDisabled}
        />
      </section>

      {/* 조리 시간 */}
      <section className='flex flex-col gap-2'>
        <Slider
          size='sm'
          label='조리 시간'
          value={formData.cooking_time}
          onValueChange={value =>
            updateField('cooking_time', Array.isArray(value) ? value[0] : value)
          }
          min={5}
          max={180}
          step={5}
          unit='분'
          disabled={isDisabled}
        />
      </section>

      {/* 카테고리 선택 */}
      {categoryGroups.map(group => (
        <section key={group.type} className='flex flex-col gap-3'>
          <Label className='text-body-2 text-text-primary font-medium'>
            {categoryTypeLabels[group.type] || group.type}
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
          재료 <span className='text-primary-base'>*</span>
        </Label>
        <div className='flex flex-col gap-3'>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className='flex gap-2 items-center'>
              <Input
                size='sm'
                placeholder='재료명'
                value={ingredient.name}
                onChange={e => updateIngredient(index, 'name', e.target.value)}
                disabled={isDisabled}
                className='flex-1'
              />
              <Input
                size='sm'
                placeholder='양'
                value={ingredient.amount}
                onChange={e =>
                  updateIngredient(index, 'amount', e.target.value)
                }
                disabled={isDisabled}
                className='w-16'
              />
              <Input
                size='sm'
                placeholder='단위'
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
          조리 단계 <span className='text-primary-base'>*</span>
        </Label>
        <div className='flex flex-col gap-3'>
          {formData.steps.map((step, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <div className='shrink-0 size-8 rounded-full bg-secondary-base text-white flex items-center justify-center text-body-2 font-medium mt-2'>
                {step.step}
              </div>
              <Textarea
                placeholder={`${step.step}단계 조리 방법을 입력하세요`}
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
        {isSubmitting ? '저장 중...' : '저장'}
      </Button>
    </div>
  );
}
