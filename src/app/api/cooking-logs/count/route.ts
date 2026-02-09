import { NextRequest } from 'next/server';
import { getCookCount } from '@/entities/cooking-log/api/server';

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
    const count = await getCookCount(userId, recipeId);
    return Response.json(count);
  } catch (error) {
    console.error('[API] GET /api/cooking-logs/count error:', error);
    return Response.json(
      { error: '요리 횟수를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
