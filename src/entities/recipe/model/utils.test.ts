import { describe, it, expect } from 'vitest';
import type { RecipeDB, RecipeInsert, RecipeUpdate } from './types';
import { formatCookingTime, toRecipe, toRecipeDB } from './utils';

/**
 * RecipeDB 테스트용 mock (모든 필드가 채워진 정상 레코드)
 */
const mockRecipeDB: RecipeDB = {
  id: 'recipe-1',
  user_id: 'user-1',
  title: '바질 토마토 파스타',
  description: '신선한 토마토와 바질',
  thumbnail_url: 'https://example.com/image.jpg',
  cooking_time: 30,
  servings: 2,
  categories: {
    situation: [{ type: 'situation', code: 'daily', name: '일상' }],
    cuisine: [{ type: 'cuisine', code: 'western', name: '양식' }],
  },
  ingredients: [{ name: '파스타', amount: '200', unit: 'g' }],
  steps: [{ step: 1, description: '면을 삶는다' }],
  is_public: true,
  view_count: 100,
  favorite_count: 20,
  cook_count: 5,
  tags: ['파스타', '양식'],
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-20T00:00:00Z',
};

/**
 * nullable 필드가 모두 null인 최소 DB 레코드
 */
const mockMinimalRecipeDB: RecipeDB = {
  id: 'recipe-2',
  user_id: 'user-2',
  title: '테스트 레시피',
  description: null,
  thumbnail_url: null,
  cooking_time: null,
  servings: null,
  categories: {},
  ingredients: [],
  steps: [],
  is_public: false,
  view_count: 0,
  favorite_count: 0,
  cook_count: 0,
  tags: [],
  created_at: null,
  updated_at: null,
};

describe('formatCookingTime', () => {
  it('60분 미만이면 분만 표시한다', () => {
    expect(formatCookingTime(30)).toBe('30분');
    expect(formatCookingTime(1)).toBe('1분');
    expect(formatCookingTime(59)).toBe('59분');
  });

  it('정확히 60분이면 시간만 표시한다', () => {
    expect(formatCookingTime(60)).toBe('1시간');
  });

  it('60분 초과이고 나머지가 0이면 시간만 표시한다', () => {
    expect(formatCookingTime(120)).toBe('2시간');
    expect(formatCookingTime(180)).toBe('3시간');
  });

  it('60분 초과이고 나머지가 있으면 시간+분으로 표시한다', () => {
    expect(formatCookingTime(90)).toBe('1시간 30분');
    expect(formatCookingTime(75)).toBe('1시간 15분');
    expect(formatCookingTime(150)).toBe('2시간 30분');
  });
});

describe('toRecipe', () => {
  it('정상 DB 레코드를 Recipe로 변환한다', () => {
    const recipe = toRecipe(mockRecipeDB);

    expect(recipe.id).toBe('recipe-1');
    expect(recipe.user_id).toBe('user-1');
    expect(recipe.title).toBe('바질 토마토 파스타');
    expect(recipe.description).toBe('신선한 토마토와 바질');
    expect(recipe.thumbnail_url).toBe('https://example.com/image.jpg');
    expect(recipe.cooking_time).toBe(30);
    expect(recipe.servings).toBe(2);
    expect(recipe.is_public).toBe(true);
    expect(recipe.view_count).toBe(100);
    expect(recipe.favorite_count).toBe(20);
    expect(recipe.cook_count).toBe(5);
    expect(recipe.tags).toEqual(['파스타', '양식']);
  });

  it('모든 nullable 필드가 null이면 optional 필드를 제외한다', () => {
    const recipe = toRecipe(mockMinimalRecipeDB);

    expect('description' in recipe).toBe(false);
    expect('thumbnail_url' in recipe).toBe(false);
    expect('cooking_time' in recipe).toBe(false);
    expect('servings' in recipe).toBe(false);
    expect('created_at' in recipe).toBe(false);
    expect('updated_at' in recipe).toBe(false);
  });

  it('categories가 객체이면 평탄화한다', () => {
    const recipe = toRecipe(mockRecipeDB);

    expect(recipe.categories).toEqual([
      { type: 'situation', code: 'daily', name: '일상' },
      { type: 'cuisine', code: 'western', name: '양식' },
    ]);
  });

  it('categories가 배열이면 그대로 사용한다', () => {
    const dbRecipe: RecipeDB = {
      ...mockRecipeDB,
      categories: [
        { type: 'situation', code: 'daily', name: '일상' },
      ] as unknown as RecipeDB['categories'],
    };
    const recipe = toRecipe(dbRecipe);

    expect(recipe.categories).toEqual([
      { type: 'situation', code: 'daily', name: '일상' },
    ]);
  });

  it('빈 categories 객체는 빈 배열이 된다', () => {
    const recipe = toRecipe(mockMinimalRecipeDB);

    expect(recipe.categories).toEqual([]);
  });

  it('Date 문자열을 Date 객체로 변환한다', () => {
    const recipe = toRecipe(mockRecipeDB);

    expect(recipe.created_at).toBeInstanceOf(Date);
    expect(recipe.updated_at).toBeInstanceOf(Date);
    expect(recipe.created_at!.toISOString()).toBe('2024-01-15T00:00:00.000Z');
  });

  it('is_public이 undefined면 false를 기본값으로 사용한다', () => {
    const dbRecipe: RecipeDB = {
      ...mockMinimalRecipeDB,
      is_public: undefined as unknown as boolean,
    };
    const recipe = toRecipe(dbRecipe);

    expect(recipe.is_public).toBe(false);
  });

  it('count 필드가 undefined면 0을 기본값으로 사용한다', () => {
    const dbRecipe: RecipeDB = {
      ...mockMinimalRecipeDB,
      view_count: undefined as unknown as number,
      favorite_count: undefined as unknown as number,
      cook_count: undefined as unknown as number,
    };
    const recipe = toRecipe(dbRecipe);

    expect(recipe.view_count).toBe(0);
    expect(recipe.favorite_count).toBe(0);
    expect(recipe.cook_count).toBe(0);
  });

  it('ingredients와 steps가 null이면 빈 배열이 된다', () => {
    const dbRecipe: RecipeDB = {
      ...mockMinimalRecipeDB,
      ingredients: null as unknown as RecipeDB['ingredients'],
      steps: null as unknown as RecipeDB['steps'],
    };
    const recipe = toRecipe(dbRecipe);

    expect(recipe.ingredients).toEqual([]);
    expect(recipe.steps).toEqual([]);
  });
});

describe('toRecipeDB', () => {
  it('RecipeInsert를 DB 형식으로 변환한다 (user_id 포함)', () => {
    const insert: RecipeInsert = {
      user_id: 'user-1',
      title: '새 레시피',
      description: '설명',
      categories: [
        { type: 'situation', code: 'daily', name: '일상' },
        { type: 'cuisine', code: 'western', name: '양식' },
      ],
    };
    const result = toRecipeDB(insert);

    expect(result.user_id).toBe('user-1');
    expect(result.title).toBe('새 레시피');
    expect(result.description).toBe('설명');
  });

  it('RecipeUpdate에 user_id가 없으면 외부 user_id를 사용한다', () => {
    const update: RecipeUpdate = { title: '수정된 제목' };
    const result = toRecipeDB(update, 'external-user');

    expect(result.user_id).toBe('external-user');
    expect(result.title).toBe('수정된 제목');
  });

  it('빈 description은 null로 변환한다', () => {
    const update: RecipeUpdate = { description: '' };
    const result = toRecipeDB(update);

    expect(result.description).toBeNull();
  });

  it('빈 thumbnail_url은 null로 변환한다', () => {
    const update: RecipeUpdate = { thumbnail_url: '' };
    const result = toRecipeDB(update);

    expect(result.thumbnail_url).toBeNull();
  });

  it('categories를 타입별로 그룹핑한다', () => {
    const insert: RecipeInsert = {
      user_id: 'user-1',
      title: '레시피',
      categories: [
        { type: 'situation', code: 'daily', name: '일상' },
        { type: 'situation', code: 'speed', name: '초스피드' },
        { type: 'cuisine', code: 'western', name: '양식' },
      ],
    };
    const result = toRecipeDB(insert);

    expect(result.categories).toEqual({
      situation: [
        { type: 'situation', code: 'daily', name: '일상' },
        { type: 'situation', code: 'speed', name: '초스피드' },
      ],
      cuisine: [{ type: 'cuisine', code: 'western', name: '양식' }],
    });
  });

  it('undefined 필드는 결과에 포함하지 않는다', () => {
    const update: RecipeUpdate = { title: '제목만 수정' };
    const result = toRecipeDB(update);

    expect(result.title).toBe('제목만 수정');
    expect('description' in result).toBe(false);
    expect('thumbnail_url' in result).toBe(false);
    expect('cooking_time' in result).toBe(false);
    expect('servings' in result).toBe(false);
    expect('categories' in result).toBe(false);
    expect('ingredients' in result).toBe(false);
    expect('steps' in result).toBe(false);
    expect('is_public' in result).toBe(false);
    expect('tags' in result).toBe(false);
  });

  it('cooking_time 0은 null로 변환한다', () => {
    const update: RecipeUpdate = { cooking_time: 0 };
    const result = toRecipeDB(update);

    expect(result.cooking_time).toBeNull();
  });
});
