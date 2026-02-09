import { NextRequest } from 'next/server';
import { getFavoriteStatuses } from '@/entities/favorite/api/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const recipeIdsParam = searchParams.get('recipeIds');

  if (!userId || !recipeIdsParam) {
    return Response.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
    );
  }

  const recipeIds = recipeIdsParam.split(',').filter(Boolean);

  try {
    const data = await getFavoriteStatuses(userId, recipeIds);
    return Response.json(data);
  } catch (error) {
    console.error('[API] GET /api/favorites/statuses error:', error);
    return Response.json(
      { error: '즐겨찾기 상태를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
