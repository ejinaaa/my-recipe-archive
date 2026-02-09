import { NextRequest } from 'next/server';
import { getUserCookCounts } from '@/entities/cooking-log/api/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 }
    );
  }

  try {
    const counts = await getUserCookCounts(userId);
    return Response.json(counts);
  } catch (error) {
    console.error('[API] GET /api/cooking-logs/user-counts error:', error);
    return Response.json(
      { error: '요리 횟수를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
