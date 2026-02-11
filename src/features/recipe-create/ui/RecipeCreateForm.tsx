'use client';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Slider } from '@/shared/ui/slider';
import { Field, FieldLabel } from '@/shared/ui/field';
import { cn } from '@/shared/lib/utils';
import { useRecipeForm, type RecipeFormData } from '../model/hooks';
import { useThumbnailUpload } from '../model/useThumbnailUpload';
import { CategoryOptionBadge } from './CategoryOptionBadge';
import { IngredientItem } from './IngredientItem';
import { StepItem } from './StepItem';
import { ThumbnailUploader } from './ThumbnailUploader';
import type { RecipeCategory } from '@/entities/recipe/model/types';
import type { CategoryGroup } from '@/entities/category/model/types';
import { CATEGORY_TYPE_LABELS } from '@/entities/category/model/constants';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
  COOKING_TIME_STEP,
  SERVINGS_MAX,
  TITLE_MAX_LENGTH,
} from '@/entities/recipe/model/constants';
import { formatCookingTime } from '@/entities/recipe/model/utils';

/** 폼 모드 */
type RecipeFormMode = 'create' | 'edit';

/** 모드별 버튼 텍스트 */
const SUBMIT_BUTTON_TEXT: Record<
  RecipeFormMode,
  { default: string; loading: string }
> = {
  create: { default: '나만의 레시피 완성!', loading: '레시피 만드는 중...' },
  edit: { default: '레시피 수정 완료!', loading: '수정하는 중...' },
};

interface RecipeCreateFormProps {
  /** 카테고리 그룹 목록 */
  categoryGroups: CategoryGroup[];
  /** 폼 제출 핸들러 */
  onSubmit: (data: RecipeFormData) => Promise<void>;
  /** 추가 클래스명 */
  className?: string;
  /** 폼 모드 (생성 또는 수정) */
  mode?: RecipeFormMode;
  /** 수정 모드에서 사용할 초기 데이터 */
  initialData?: RecipeFormData;
  /** 현재 사용자 ID (썸네일 업로드에 필요) */
  userId?: string;
}

/**
 * 레시피 생성/수정 폼 컴포넌트
 */
export function RecipeCreateForm({
  categoryGroups,
  onSubmit,
  className,
  mode = 'create',
  initialData,
  userId,
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
  } = useRecipeForm({ onSubmit, initialData });

  const {
    isUploading,
    error: uploadError,
    handleFileSelect,
    handleDelete,
  } = useThumbnailUpload({
    userId: userId ?? '',
    currentUrl: formData.thumbnail_url,
    onUrlChange: url => updateField('thumbnail_url', url),
  });

  const buttonText = SUBMIT_BUTTON_TEXT[mode];

  const isDisabled = isSubmitting || isUploading;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* 썸네일 이미지 */}
      <ThumbnailUploader
        thumbnailUrl={formData.thumbnail_url}
        isUploading={isUploading}
        error={uploadError}
        disabled={isDisabled}
        onFileSelect={handleFileSelect}
        onDelete={handleDelete}
      />

      {/* 제목 */}
      <Field>
        <FieldLabel required>요리 이름</FieldLabel>
        <Input
          placeholder='맛있는 요리 이름을 알려주세요'
          value={formData.title}
          onChange={e => updateField('title', e.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          disabled={isDisabled}
          size='sm'
        />
        <span className='text-caption text-text-secondary text-right'>
          {formData.title.length}/{TITLE_MAX_LENGTH}
        </span>
      </Field>

      {/* 설명 */}
      <Field>
        <FieldLabel>요리 소개</FieldLabel>
        <Textarea
          placeholder='이 요리의 매력을 소개해 주세요'
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          disabled={isDisabled}
          size='sm'
        />
      </Field>

      {/* 인분 */}
      <Field>
        <FieldLabel required>몇 인분</FieldLabel>
        <Slider
          size='sm'
          value={formData.servings}
          onValueChange={value =>
            updateField('servings', Array.isArray(value) ? value[0] : value)
          }
          min={1}
          max={SERVINGS_MAX}
          step={1}
          valueDisplay={`${formData.servings}인분`}
          disabled={isDisabled}
        />
      </Field>

      {/* 조리 시간 */}
      <Field>
        <FieldLabel required>만드는 시간</FieldLabel>
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
      </Field>

      {/* 카테고리 선택 */}
      {categoryGroups.map(group => (
        <Field key={group.type} className='gap-3'>
          <FieldLabel required>{CATEGORY_TYPE_LABELS[group.type]}</FieldLabel>
          <div className='flex flex-wrap gap-2'>
            {group.options.map(option => (
              <CategoryOptionBadge
                key={`${option.type}-${option.code}`}
                option={option}
                selected={
                  formData.categories[option.type]?.some(
                    c => c.code === option.code,
                  ) ?? false
                }
                onClick={() =>
                  toggleCategory({
                    type: option.type,
                    code: option.code,
                    name: option.name,
                  } as RecipeCategory)
                }
                disabled={isDisabled}
              />
            ))}
          </div>
        </Field>
      ))}

      {/* 재료 */}
      <Field className='gap-3'>
        <FieldLabel required>필요한 재료</FieldLabel>
        <div className='flex flex-col gap-3'>
          {formData.ingredients.map((ingredient, index) => (
            <IngredientItem
              key={index}
              name={ingredient.name}
              amount={ingredient.amount}
              unit={ingredient.unit || ''}
              onFieldChange={(field, value) =>
                updateIngredient(index, field, value)
              }
              onInsert={() => insertIngredientAt(index)}
              onRemove={() => removeIngredient(index)}
              disabled={isDisabled}
              removeDisabled={isDisabled || formData.ingredients.length <= 1}
            />
          ))}
        </div>
      </Field>

      {/* 조리 단계 */}
      <Field className='gap-3'>
        <FieldLabel required>만드는 순서</FieldLabel>
        <div className='flex flex-col gap-3'>
          {formData.steps.map((step, index) => (
            <StepItem
              key={index}
              stepNumber={step.step}
              description={step.description}
              onDescriptionChange={value => updateStep(index, value)}
              onInsert={() => insertStepAt(index)}
              onRemove={() => removeStep(index)}
              disabled={isDisabled}
              removeDisabled={isDisabled || formData.steps.length <= 1}
            />
          ))}
        </div>
      </Field>

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
        {isSubmitting ? buttonText.loading : buttonText.default}
      </Button>
    </div>
  );
}
