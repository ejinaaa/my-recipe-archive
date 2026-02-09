import { NextRequest } from 'next/server';
import { getCategoryOption } from '@/entities/category/api/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return Response.json(
      { error: '유효하지 않은 ID입니다.' },
      { status: 400 }
    );
  }

  try {
    const data = await getCategoryOption(numericId);

    if (!data) {
      return Response.json(
        { error: '카테고리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error(`[API] GET /api/categories/options/${id} error:`, error);
    return Response.json(
      { error: '카테고리를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
