'use client';

import { useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  RecipeCategory,
  Ingredient,
  CookingStep,
} from '@/entities/recipe/model/types';
import { recipeFormSchema, type RecipeFormData } from './schema';

export type { RecipeFormData };

/**
 * 기본 재료 항목 생성
 */
const createEmptyIngredient = (): Ingredient => ({
  name: '',
  amount: '',
  unit: '',
});

/**
 * 기본 조리 단계 생성
 */
const createEmptyStep = (stepNumber: number): CookingStep => ({
  step: stepNumber,
  description: '',
});

/**
 * 폼 초기값
 */
const defaultValues: RecipeFormData = {
  title: '',
  description: '',
  thumbnail_url: '',
  cooking_time: 30,
  servings: 2,
  categories: {},
  ingredients: [createEmptyIngredient()],
  steps: [createEmptyStep(1)],
};

interface UseRecipeFormOptions {
  onSubmit: (data: RecipeFormData) => Promise<void>;
  /** 수정 모드에서 사용할 초기 데이터 */
  initialData?: RecipeFormData;
}

/**
 * 레시피 생성/수정 폼 상태 관리 훅
 */
export function useRecipeForm({ onSubmit, initialData }: UseRecipeFormOptions) {
  const {
    control,
    setValue,
    getValues,
    watch,
    reset,
    handleSubmit: rhfHandleSubmit,
    formState,
  } = useForm<RecipeFormData>({
    // zod 스키마의 카테고리 타입이 RecipeCategory 분별 유니온과 구조적으로 호환되지 않아 타입 단언 사용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(recipeFormSchema) as any,
    defaultValues: initialData ?? defaultValues,
    mode: 'onChange',
  });

  const ingredientFieldArray = useFieldArray({
    control,
    name: 'ingredients',
  });

  const stepFieldArray = useFieldArray({
    control,
    name: 'steps',
  });

  // 전체 폼 데이터 (기존 인터페이스 호환)
  const formData = watch();

  // 기본 필드 업데이트
  const updateField = useCallback(
    <K extends keyof RecipeFormData>(field: K, value: RecipeFormData[K]) => {
      // react-hook-form의 Path 타입과 제네릭 K의 호환을 위해 타입 단언 사용
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(field, value as any, { shouldValidate: true });
    },
    [setValue],
  );

  // 카테고리 토글
  const toggleCategory = useCallback(
    (category: RecipeCategory) => {
      const current = getValues('categories');
      const newCategories = { ...current };
      const list = newCategories[category.type] ?? [];

      if (category.type === 'situation') {
        // Multi-select: 토글 (있으면 제거, 없으면 추가)
        const exists = list.some(c => c.code === category.code);
        newCategories[category.type] = exists
          ? list.filter(c => c.code !== category.code)
          : [...list, category];
        // 빈 배열이면 키 삭제
        if (newCategories[category.type]?.length === 0) {
          delete newCategories[category.type];
        }
      } else {
        // Single-select: 같으면 해제, 다르면 교체
        const isSelected =
          list.length === 1 && list[0].code === category.code;
        if (isSelected) {
          delete newCategories[category.type];
        } else {
          newCategories[category.type] = [category];
        }
      }

      setValue('categories', newCategories, { shouldValidate: true });
    },
    [getValues, setValue],
  );

  // 재료 업데이트
  const updateIngredient = useCallback(
    (index: number, field: keyof Ingredient, value: string) => {
      setValue(`ingredients.${index}.${field}` as `ingredients.${number}.${keyof Ingredient}`, value, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  // 재료 삽입 (특정 인덱스 아래에)
  const insertIngredientAt = useCallback(
    (index: number) => {
      ingredientFieldArray.insert(index + 1, createEmptyIngredient());
    },
    [ingredientFieldArray],
  );

  // 재료 삭제 (최소 1개 유지)
  const removeIngredient = useCallback(
    (index: number) => {
      if (getValues('ingredients').length <= 1) return;
      ingredientFieldArray.remove(index);
    },
    [ingredientFieldArray, getValues],
  );

  // 조리 단계 업데이트
  const updateStep = useCallback(
    (index: number, description: string) => {
      setValue(`steps.${index}.description`, description, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  // 조리 단계 삽입 (특정 인덱스 아래에, step 번호 재정렬)
  const insertStepAt = useCallback(
    (index: number) => {
      stepFieldArray.insert(index + 1, createEmptyStep(index + 2));
      // 삽입 후 step 번호 재정렬
      const steps = getValues('steps');
      steps.forEach((_, i) => {
        setValue(`steps.${i}.step`, i + 1);
      });
    },
    [stepFieldArray, getValues, setValue],
  );

  // 조리 단계 삭제 (최소 1개 유지, step 번호 재정렬)
  const removeStep = useCallback(
    (index: number) => {
      if (getValues('steps').length <= 1) return;
      stepFieldArray.remove(index);
      // 삭제 후 step 번호 재정렬
      const steps = getValues('steps');
      steps.forEach((_, i) => {
        setValue(`steps.${i}.step`, i + 1);
      });
    },
    [stepFieldArray, getValues, setValue],
  );

  // 폼 제출 (빈 재료/단계 필터링)
  const handleSubmit = useCallback(async () => {
    await rhfHandleSubmit(async (data: RecipeFormData) => {
      const cleanedData: RecipeFormData = {
        ...data,
        ingredients: data.ingredients.filter(
          ing => ing.name.trim() && ing.amount.trim(),
        ),
        steps: data.steps
          .filter(step => step.description.trim())
          .map((step, i) => ({ ...step, step: i + 1 })),
      };
      await onSubmit(cleanedData);
    })();
  }, [rhfHandleSubmit, onSubmit]);

  // 폼 리셋
  const resetForm = useCallback(() => {
    reset(defaultValues);
  }, [reset]);

  return {
    formData,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    updateField,
    toggleCategory,
    updateIngredient,
    insertIngredientAt,
    removeIngredient,
    updateStep,
    insertStepAt,
    removeStep,
    handleSubmit,
    resetForm,
  };
}
