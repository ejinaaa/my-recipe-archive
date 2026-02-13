import { describe, it, expect } from 'vitest';
import { recipeFormSchema } from './schema';

/**
 * 모든 필수 필드가 채워진 유효한 폼 데이터
 */
const validFormData = {
  title: '바질 파스타',
  description: '',
  thumbnail_url: '',
  cooking_time: 30,
  servings: 2,
  categories: {
    situation: [{ type: 'situation' as const, code: 'daily', name: '일상' }],
    cuisine: [{ type: 'cuisine' as const, code: 'western', name: '양식' }],
    dishType: [{ type: 'dishType' as const, code: 'noodle', name: '면요리' }],
  },
  ingredients: [{ name: '파스타', amount: '200', unit: 'g' }],
  steps: [{ step: 1, description: '면을 삶는다' }],
};

describe('recipeFormSchema', () => {
  it('모든 필수 필드가 채워지면 유효하다', () => {
    const result = recipeFormSchema.safeParse(validFormData);

    expect(result.success).toBe(true);
  });

  it('title이 비면 실패한다', () => {
    const result = recipeFormSchema.safeParse({
      ...validFormData,
      title: '',
    });

    expect(result.success).toBe(false);
  });

  it('title이 공백만 있으면 실패한다', () => {
    const result = recipeFormSchema.safeParse({
      ...validFormData,
      title: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('situation 카테고리가 없으면 실패한다', () => {
    const result = recipeFormSchema.safeParse({
      ...validFormData,
      categories: {
        cuisine: [{ type: 'cuisine', code: 'western', name: '양식' }],
        dishType: [{ type: 'dishType', code: 'noodle', name: '면요리' }],
      },
    });

    expect(result.success).toBe(false);
  });

  it('cuisine이 없으면 실패한다', () => {
    const result = recipeFormSchema.safeParse({
      ...validFormData,
      categories: {
        situation: [{ type: 'situation', code: 'daily', name: '일상' }],
        dishType: [{ type: 'dishType', code: 'noodle', name: '면요리' }],
      },
    });

    expect(result.success).toBe(false);
  });

  it('dishType이 없으면 실패한다', () => {
    const result = recipeFormSchema.safeParse({
      ...validFormData,
      categories: {
        situation: [{ type: 'situation', code: 'daily', name: '일상' }],
        cuisine: [{ type: 'cuisine', code: 'western', name: '양식' }],
      },
    });

    expect(result.success).toBe(false);
  });

  it('유효한 재료가 없으면 실패한다', () => {
    const result = recipeFormSchema.safeParse({
      ...validFormData,
      ingredients: [{ name: '', amount: '', unit: '' }],
    });

    expect(result.success).toBe(false);
  });

  it('유효한 조리 단계가 없으면 실패한다', () => {
    const result = recipeFormSchema.safeParse({
      ...validFormData,
      steps: [{ step: 1, description: '' }],
    });

    expect(result.success).toBe(false);
  });
});
