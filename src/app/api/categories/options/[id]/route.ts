import { NextRequest } from 'next/server';
import { getCategoryOptionApi } from '@/entities/category/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return Response.json(
      { error: '유효하지 않은 요청이에요' },
      { status: 400 }
    );
  }

  try {
    const data = await getCategoryOptionApi(numericId);

    if (!data) {
      return Response.json(
        { error: '카테고리를 찾을 수 없어요' },
        { status: 404 }
      );
    }

    return Response.json(data);
  } catch (error) {
    return handleRouteError(error, `GET /api/categories/options/${id}`);
  }
}
