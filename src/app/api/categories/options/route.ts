import { NextRequest } from 'next/server';
import { getCategoryOptions } from '@/entities/category/api/server';
import type { CategoryType } from '@/entities/category/model/types';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get('type') as CategoryType) || undefined;

  try {
    const data = await getCategoryOptions(type);
    return Response.json(data);
  } catch (error) {
    return handleRouteError(error, 'GET /api/categories/options');
  }
}
