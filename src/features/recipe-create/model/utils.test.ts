import { describe, it, expect } from 'vitest';
import type { Recipe, RecipeCategory } from '@/entities/recipe/model/types';
import { mockRecipes } from '@/entities/recipe/model/mock';
import type { RecipeFormData } from './schema';
import {
  convertCategoriesToFormData,
  convertFormDataToRecipeData,
  convertRecipeToFormData,
} from './utils';

describe('convertCategoriesToFormData', () => {
  it('카테고리 배열을 타입별 객체로 변환한다', () => {
    const categories: RecipeCategory[] = [
      { type: 'situation', code: 'daily', name: '일상' },
      { type: 'situation', code: 'speed', name: '초스피드' },
      { type: 'cuisine', code: 'western', name: '양식' },
      { type: 'dishType', code: 'noodle', name: '면요리' },
    ];
    const result = convertCategoriesToFormData(categories);

    expect(result.situation).toHaveLength(2);
    expect(result.cuisine).toHaveLength(1);
    expect(result.dishType).toHaveLength(1);
  });

  it('빈 배열은 빈 객체를 반환한다', () => {
    const result = convertCategoriesToFormData([]);

    expect(result).toEqual({});
  });
});

describe('convertFormDataToRecipeData', () => {
  const validFormData: RecipeFormData = {
    title: '바질 파스타',
    description: '맛있는 파스타',
    thumbnail_url: 'https://example.com/image.jpg',
    cooking_time: 30,
    servings: 2,
    categories: {
      situation: [{ type: 'situation', code: 'daily', name: '일상' }],
      cuisine: [{ type: 'cuisine', code: 'western', name: '양식' }],
    },
    ingredients: [{ name: '파스타', amount: '200', unit: 'g' }],
    steps: [{ step: 1, description: '면을 삶는다' }],
  };

  it('폼 데이터를 API 전송용 데이터로 변환한다', () => {
    const result = convertFormDataToRecipeData(validFormData);

    expect(result.title).toBe('바질 파스타');
    expect(result.description).toBe('맛있는 파스타');
    expect(result.cooking_time).toBe(30);
    expect(result.servings).toBe(2);
  });

  it('빈 description은 undefined로 변환한다', () => {
    const formData: RecipeFormData = { ...validFormData, description: '' };
    const result = convertFormDataToRecipeData(formData);

    expect(result.description).toBeUndefined();
  });

  it('빈 thumbnail_url은 undefined로 변환한다', () => {
    const formData: RecipeFormData = { ...validFormData, thumbnail_url: '' };
    const result = convertFormDataToRecipeData(formData);

    expect(result.thumbnail_url).toBeUndefined();
  });

  it('categories 객체를 평탄화한다', () => {
    const result = convertFormDataToRecipeData(validFormData);

    expect(result.categories).toEqual([
      { type: 'situation', code: 'daily', name: '일상' },
      { type: 'cuisine', code: 'western', name: '양식' },
    ]);
  });
});

describe('convertRecipeToFormData', () => {
  it('Recipe를 RecipeFormData로 변환한다', () => {
    const recipe = mockRecipes[0];
    const result = convertRecipeToFormData(recipe);

    expect(result.title).toBe(recipe.title);
    expect(result.description).toBe(recipe.description);
    expect(result.cooking_time).toBe(recipe.cooking_time);
    expect(result.servings).toBe(recipe.servings);
    expect(result.ingredients).toBe(recipe.ingredients);
    expect(result.steps).toBe(recipe.steps);
  });

  it('빈 ingredients는 기본 빈 항목 1개로 채운다', () => {
    const recipe: Recipe = { ...mockRecipes[0], ingredients: [] };
    const result = convertRecipeToFormData(recipe);

    expect(result.ingredients).toEqual([{ name: '', amount: '', unit: '' }]);
  });

  it('빈 steps는 기본 빈 단계 1개로 채운다', () => {
    const recipe: Recipe = { ...mockRecipes[0], steps: [] };
    const result = convertRecipeToFormData(recipe);

    expect(result.steps).toEqual([{ step: 1, description: '' }]);
  });

  it('description이 없으면 빈 문자열로 채운다', () => {
    const recipe: Recipe = { ...mockRecipes[0] };
    delete (recipe as { description?: string }).description;
    const result = convertRecipeToFormData(recipe);

    expect(result.description).toBe('');
  });

  it('cooking_time이 없으면 30을 기본값으로 사용한다', () => {
    const recipe: Recipe = { ...mockRecipes[0] };
    delete (recipe as { cooking_time?: number }).cooking_time;
    const result = convertRecipeToFormData(recipe);

    expect(result.cooking_time).toBe(30);
  });

  it('servings가 없으면 2를 기본값으로 사용한다', () => {
    const recipe: Recipe = { ...mockRecipes[0] };
    delete (recipe as { servings?: number }).servings;
    const result = convertRecipeToFormData(recipe);

    expect(result.servings).toBe(2);
  });

  it('categories를 타입별 객체로 변환한다', () => {
    const recipe = mockRecipes[0];
    const result = convertRecipeToFormData(recipe);

    expect(result.categories.situation).toBeDefined();
    expect(result.categories.cuisine).toBeDefined();
    expect(result.categories.dishType).toBeDefined();
  });
});
