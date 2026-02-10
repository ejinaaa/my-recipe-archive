import { getCategoryGroups } from '@/entities/category/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET() {
  try {
    const data = await getCategoryGroups();
    return Response.json(data);
  } catch (error) {
    return handleRouteError(error, 'GET /api/categories/groups');
  }
}
