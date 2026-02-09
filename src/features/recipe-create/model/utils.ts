import type { Recipe, RecipeCategory } from '@/entities/recipe/model/types';
import type { CategoryType } from '@/entities/category/model/types';
import type { RecipeFormData } from './hooks';

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
