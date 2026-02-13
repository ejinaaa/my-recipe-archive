import { NextResponse } from 'next/server';
import { getRandomRecipeApi } from '@/entities/recipe/api/server';
import { getCurrentProfileApi } from '@/entities/user/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentProfile = await getCurrentProfileApi();
    if (!currentProfile) {
      return NextResponse.json({ error: '로그인이 필요해요' }, { status: 401 });
    }

    const recipe = await getRandomRecipeApi(currentProfile.id);
    return NextResponse.json(recipe);
  } catch (error) {
    return handleRouteError(error, 'GET /api/recipes/random');
  }
}
