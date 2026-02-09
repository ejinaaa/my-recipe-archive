'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  RecipeCategory,
  Ingredient,
  CookingStep,
} from '@/entities/recipe/model/types';
import type { CategoryType } from '@/entities/category/model/types';

/**
 * 레시피 생성 폼의 데이터 타입
 */
export interface RecipeFormData {
  title: string;
  description: string;
  thumbnail_url: string;
  cooking_time: number;
  servings: number;
  categories: Partial<Record<CategoryType, RecipeCategory[]>>;
  ingredients: Ingredient[];
  steps: CookingStep[];
}

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
const initialFormData: RecipeFormData = {
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
  const [formData, setFormData] = useState<RecipeFormData>(
    initialData ?? initialFormData,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기본 필드 업데이트
  const updateField = useCallback(
    <K extends keyof RecipeFormData>(field: K, value: RecipeFormData[K]) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    [],
  );

  // 카테고리 토글
  const toggleCategory = useCallback((category: RecipeCategory) => {
    setFormData(prev => {
      const newCategories = { ...prev.categories };
      const current = newCategories[category.type] ?? [];

      if (category.type === 'situation') {
        // Multi-select: 토글 (있으면 제거, 없으면 추가)
        const exists = current.some(c => c.code === category.code);
        newCategories[category.type] = exists
          ? current.filter(c => c.code !== category.code)
          : [...current, category];
        // 빈 배열이면 키 삭제
        if (newCategories[category.type]?.length === 0) {
          delete newCategories[category.type];
        }
      } else {
        // Single-select: 같으면 해제, 다르면 교체
        const isSelected =
          current.length === 1 && current[0].code === category.code;
        if (isSelected) {
          delete newCategories[category.type];
        } else {
          newCategories[category.type] = [category];
        }
      }

      return { ...prev, categories: newCategories };
    });
  }, []);

  // 재료 업데이트
  const updateIngredient = useCallback(
    (index: number, field: keyof Ingredient, value: string) => {
      setFormData(prev => {
        const newIngredients = [...prev.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        return { ...prev, ingredients: newIngredients };
      });
    },
    [],
  );

  // 재료 삽입 (특정 인덱스 아래에)
  const insertIngredientAt = useCallback((index: number) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients.splice(index + 1, 0, createEmptyIngredient());
      return { ...prev, ingredients: newIngredients };
    });
  }, []);

  // 재료 삭제 (최소 1개 유지)
  const removeIngredient = useCallback((index: number) => {
    setFormData(prev => {
      if (prev.ingredients.length <= 1) return prev;
      const newIngredients = prev.ingredients.filter((_, i) => i !== index);
      return { ...prev, ingredients: newIngredients };
    });
  }, []);

  // 조리 단계 업데이트
  const updateStep = useCallback((index: number, description: string) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], description };
      return { ...prev, steps: newSteps };
    });
  }, []);

  // 조리 단계 삽입 (특정 인덱스 아래에, step 번호 재정렬)
  const insertStepAt = useCallback((index: number) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps.splice(index + 1, 0, createEmptyStep(index + 2));
      // step 번호 재정렬
      const reorderedSteps = newSteps.map((step, i) => ({
        ...step,
        step: i + 1,
      }));
      return { ...prev, steps: reorderedSteps };
    });
  }, []);

  // 조리 단계 삭제 (최소 1개 유지)
  const removeStep = useCallback((index: number) => {
    setFormData(prev => {
      if (prev.steps.length <= 1) return prev;
      const newSteps = prev.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, step: i + 1 }));
      return { ...prev, steps: newSteps };
    });
  }, []);

  // 유효성 검사
  const isValid = useMemo(() => {
    // title 필수
    if (!formData.title.trim()) return false;

    // 인분 필수 (기본값이 있으므로 항상 통과)
    if (!formData.servings) return false;

    // 조리 시간 필수 (기본값이 있으므로 항상 통과)
    if (!formData.cooking_time) return false;

    // 카테고리 필수 (situation 1개 이상, cuisine/dishType 정확히 1개)
    const hasAllCategories =
      (formData.categories.situation?.length ?? 0) >= 1 &&
      (formData.categories.cuisine?.length ?? 0) === 1 &&
      (formData.categories.dishType?.length ?? 0) === 1;
    if (!hasAllCategories) return false;

    // 재료 최소 1개 내용 필수
    const hasValidIngredient = formData.ingredients.some(
      ing => ing.name.trim() && ing.amount.trim(),
    );
    if (!hasValidIngredient) return false;

    // 조리 단계 최소 1개 내용 필수
    const hasValidStep = formData.steps.some(step => step.description.trim());
    if (!hasValidStep) return false;

    return true;
  }, [formData]);

  // 폼 제출
  const handleSubmit = useCallback(async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 빈 재료/단계 필터링
      const cleanedData: RecipeFormData = {
        ...formData,
        ingredients: formData.ingredients.filter(
          ing => ing.name.trim() && ing.amount.trim(),
        ),
        steps: formData.steps
          .filter(step => step.description.trim())
          .map((step, i) => ({ ...step, step: i + 1 })),
      };
      await onSubmit(cleanedData);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isValid, isSubmitting, onSubmit]);

  // 폼 리셋
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return {
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
    resetForm,
  };
}
