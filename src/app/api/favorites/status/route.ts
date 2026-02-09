import { NextRequest } from 'next/server';
import { isFavorited } from '@/entities/favorite/api/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const recipeId = searchParams.get('recipeId');

  if (!userId || !recipeId) {
    return Response.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
    );
  }

  try {
    const data = await isFavorited(userId, recipeId);
    return Response.json(data);
  } catch (error) {
    console.error('[API] GET /api/favorites/status error:', error);
    return Response.json(
      { error: '즐겨찾기 상태를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
