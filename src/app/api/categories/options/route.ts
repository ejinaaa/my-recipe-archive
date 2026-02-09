import { NextRequest } from 'next/server';
import { getCategoryOptions } from '@/entities/category/api/server';
import type { CategoryType } from '@/entities/category/model/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get('type') as CategoryType) || undefined;

  try {
    const data = await getCategoryOptions(type);
    return Response.json(data);
  } catch (error) {
    console.error('[API] GET /api/categories/options error:', error);
    return Response.json(
      { error: '카테고리 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
