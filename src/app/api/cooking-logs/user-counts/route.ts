import { NextRequest } from 'next/server';
import { getUserCookCountsApi } from '@/entities/cooking-log/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json(
      { error: '필수 정보가 누락되었어요' },
      { status: 400 }
    );
  }

  try {
    const counts = await getUserCookCountsApi(userId);
    return Response.json(counts);
  } catch (error) {
    return handleRouteError(error, 'GET /api/cooking-logs/user-counts');
  }
}
