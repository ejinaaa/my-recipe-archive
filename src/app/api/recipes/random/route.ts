import { NextResponse } from 'next/server';
import { getRandomRecipe } from '@/entities/recipe/api/server';
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET() {
  try {
    const recipe = await getRandomRecipe();
    return NextResponse.json(recipe);
  } catch (error) {
    return handleRouteError(error, 'GET /api/recipes/random');
  }
}
