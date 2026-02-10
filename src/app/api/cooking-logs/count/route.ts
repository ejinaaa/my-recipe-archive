import { NextRequest } from 'next/server';
import { getCookCount } from '@/entities/cooking-log/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const recipeId = searchParams.get('recipeId');

  if (!userId || !recipeId) {
    return Response.json(
      { error: '필수 정보가 누락되었어요' },
      { status: 400 }
    );
  }

  try {
    const count = await getCookCount(userId, recipeId);
    return Response.json(count);
  } catch (error) {
    return handleRouteError(error, 'GET /api/cooking-logs/count');
  }
}
