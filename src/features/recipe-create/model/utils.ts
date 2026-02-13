import type {
  Recipe,
  RecipeCategory,
  Ingredient,
  CookingStep,
} from '@/entities/recipe/model/types';
import type { CategoryType } from '@/entities/category/model/types';
import type { RecipeFormData } from './schema';

/**
 * convertFormDataToRecipeData의 반환 타입
 * RecipeInsert(user_id 추가), RecipeUpdate(그대로) 모두에 스프레드 가능
 */
export interface RecipeData {
  title: string;
  description?: string;
  thumbnail_url?: string;
  cooking_time: number;
  servings: number;
  categories: RecipeCategory[];
  ingredients: Ingredient[];
  steps: CookingStep[];
}

/**
 * Recipe.categories 배열을 RecipeFormData.categories 객체로 변환
 * 각 타입별로 배열로 그룹핑
 */
export const convertCategoriesToFormData = (
  categories: RecipeCategory[],
): Partial<Record<CategoryType, RecipeCategory[]>> => {
  return categories.reduce(
    (acc, cat) => {
      const list = acc[cat.type] ?? [];
      list.push(cat);
      acc[cat.type] = list;
      return acc;
    },
    {} as Partial<Record<CategoryType, RecipeCategory[]>>,
  );
};

/**
 * Recipe 엔티티를 RecipeFormData로 변환
 */
/**
 * RecipeFormData를 API 전송용 데이터로 변환
 * RecipeInsert/RecipeUpdate 공통 필드
 */
export const convertFormDataToRecipeData = (
  formData: RecipeFormData,
): RecipeData => {
  const categories = Object.values(formData.categories)
    .flat()
    .filter((cat): cat is RecipeCategory => cat !== undefined);

  return {
    title: formData.title,
    description: formData.description || undefined,
    thumbnail_url: formData.thumbnail_url || undefined,
    cooking_time: formData.cooking_time,
    servings: formData.servings,
    categories,
    ingredients: formData.ingredients,
    steps: formData.steps,
  };
};

/**
 * Recipe 엔티티를 RecipeFormData로 변환
 */
export const convertRecipeToFormData = (recipe: Recipe): RecipeFormData => {
  return {
    title: recipe.title,
    description: recipe.description || '',
    thumbnail_url: recipe.thumbnail_url || '',
    cooking_time: recipe.cooking_time || 30,
    servings: recipe.servings || 2,
    categories: convertCategoriesToFormData(recipe.categories),
    ingredients:
      recipe.ingredients.length > 0
        ? recipe.ingredients
        : [{ name: '', amount: '', unit: '' }],
    steps:
      recipe.steps.length > 0
        ? recipe.steps
        : [{ step: 1, description: '' }],
  };
};
