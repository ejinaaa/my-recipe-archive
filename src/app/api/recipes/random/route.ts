import { NextResponse } from 'next/server';
import { getRandomRecipeApi } from '@/entities/recipe/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const recipe = await getRandomRecipeApi();
    return NextResponse.json(recipe);
  } catch (error) {
    return handleRouteError(error, 'GET /api/recipes/random');
  }
}
