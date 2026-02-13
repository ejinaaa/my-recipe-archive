import { getRecipeApi } from '@/entities/recipe/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const recipe = await getRecipeApi(id);

    if (!recipe) {
      return Response.json(
        { error: '레시피를 찾을 수 없어요' },
        { status: 404 }
      );
    }

    return Response.json(recipe);
  } catch (error) {
    return handleRouteError(error, 'GET /api/recipes/[id]');
  }
}
