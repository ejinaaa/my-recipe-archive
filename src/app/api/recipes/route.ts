import { NextRequest } from 'next/server';
import {
  getRecipesPaginatedApi,
  type CategoryFilter,
  type CookingTimeRange,
  type RecipeSortBy,
} from '@/entities/recipe/api/server';
import { RECIPE_PAGE_SIZE } from '@/entities/recipe/model/constants';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // 쿼리 파라미터 파싱
  const limit = Number(searchParams.get('limit')) || RECIPE_PAGE_SIZE;
  const offset = Number(searchParams.get('offset')) || 0;
  const searchQuery = searchParams.get('searchQuery') || undefined;
  const sortBy = (searchParams.get('sortBy') as RecipeSortBy) || undefined;
  const favoritesByUserId = searchParams.get('favoritesByUserId') || undefined;

  // 카테고리 필터 파싱 (콤마 구분 배열)
  const categories: CategoryFilter | undefined = (() => {
    const situation = searchParams.get('categories.situation')?.split(',').filter(Boolean);
    const cuisine = searchParams.get('categories.cuisine')?.split(',').filter(Boolean);
    const dishType = searchParams.get('categories.dishType')?.split(',').filter(Boolean);
    if (!situation?.length && !cuisine?.length && !dishType?.length) return undefined;
    return { situation, cuisine, dishType };
  })();

  // 조리 시간 범위 파싱
  const cookingTimeRange: CookingTimeRange | undefined = (() => {
    const min = searchParams.get('cookingTimeRange.min');
    const max = searchParams.get('cookingTimeRange.max');
    if (!min && !max) return undefined;
    return {
      min: min ? Number(min) : undefined,
      max: max ? Number(max) : undefined,
    };
  })();

  try {
    const data = await getRecipesPaginatedApi({
      limit,
      offset,
      searchQuery,
      sortBy,
      favoritesByUserId,
      categories,
      cookingTimeRange,
    });

    return Response.json(data);
  } catch (error) {
    return handleRouteError(error, 'GET /api/recipes');
  }
}
