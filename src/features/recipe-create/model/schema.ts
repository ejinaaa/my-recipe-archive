import { z } from 'zod';
import type {
  RecipeCategory,
  Ingredient,
  CookingStep,
} from '@/entities/recipe/model/types';
import type { CategoryType } from '@/entities/category/model/types';
import {
  COOKING_TIME_MIN,
  COOKING_TIME_MAX,
  SERVINGS_MAX,
  TITLE_MAX_LENGTH,
} from '@/entities/recipe/model/constants';

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

/** 재료 스키마 */
const ingredientSchema = z.object({
  name: z.string(),
  amount: z.string(),
  unit: z.string().optional(),
});

/** 조리 단계 스키마 */
const cookingStepSchema = z.object({
  step: z.number(),
  description: z.string(),
  image_url: z.string().optional(),
});

/** 레시피 카테고리 스키마 */
const recipeCategorySchema = z.object({
  type: z.enum(['situation', 'cuisine', 'dishType']),
  code: z.string(),
  name: z.string(),
});

/** 카테고리 맵 스키마 */
const categoriesSchema = z
  .object({
    situation: z.array(recipeCategorySchema).optional(),
    cuisine: z.array(recipeCategorySchema).optional(),
    dishType: z.array(recipeCategorySchema).optional(),
  })
  .refine((cats) => (cats.situation?.length ?? 0) >= 1, {
    message: '상황을 1개 이상 선택해주세요',
  })
  .refine((cats) => (cats.cuisine?.length ?? 0) === 1, {
    message: '장르를 선택해주세요',
  })
  .refine((cats) => (cats.dishType?.length ?? 0) === 1, {
    message: '요리 종류를 선택해주세요',
  });

/**
 * 레시피 폼 검증 스키마
 */
export const recipeFormSchema = z
  .object({
    title: z
      .string()
      .min(1, '요리 이름을 입력해주세요')
      .max(TITLE_MAX_LENGTH, `제목은 ${TITLE_MAX_LENGTH}자 이내로 입력해주세요`)
      .refine((v) => v.trim().length > 0, '요리 이름을 입력해주세요'),
    description: z.string(),
    thumbnail_url: z.string(),
    cooking_time: z.number().min(COOKING_TIME_MIN).max(COOKING_TIME_MAX),
    servings: z.number().min(1).max(SERVINGS_MAX),
    categories: categoriesSchema,
    ingredients: z.array(ingredientSchema),
    steps: z.array(cookingStepSchema),
  })
  .refine(
    (data) =>
      data.ingredients.some((ing) => ing.name.trim() && ing.amount.trim()),
    { message: '재료를 1개 이상 입력해주세요', path: ['ingredients'] },
  )
  .refine(
    (data) => data.steps.some((step) => step.description.trim()),
    { message: '조리 단계를 1개 이상 입력해주세요', path: ['steps'] },
  );
