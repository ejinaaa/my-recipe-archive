import { getRecipe } from '@/entities/recipe/api/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const recipe = await getRecipe(id);

    if (!recipe) {
      return Response.json(
        { error: '레시피를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return Response.json(recipe);
  } catch (error) {
    console.error('[API] GET /api/recipes/[id] error:', error);
    return Response.json(
      { error: '레시피를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
