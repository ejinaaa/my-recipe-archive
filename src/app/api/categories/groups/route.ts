import { getCategoryGroups } from '@/entities/category/api/server';

export async function GET() {
  try {
    const data = await getCategoryGroups();
    return Response.json(data);
  } catch (error) {
    console.error('[API] GET /api/categories/groups error:', error);
    return Response.json(
      { error: '카테고리 그룹을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
