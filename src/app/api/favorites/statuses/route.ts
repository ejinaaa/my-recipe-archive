import { NextRequest } from 'next/server';
import { getFavoriteStatuses } from '@/entities/favorite/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const recipeIdsParam = searchParams.get('recipeIds');

  if (!userId || !recipeIdsParam) {
    return Response.json(
      { error: '필수 정보가 누락되었어요' },
      { status: 400 }
    );
  }

  const recipeIds = recipeIdsParam.split(',').filter(Boolean);

  try {
    const data = await getFavoriteStatuses(userId, recipeIds);
    return Response.json(data);
  } catch (error) {
    return handleRouteError(error, 'GET /api/favorites/statuses');
  }
}
