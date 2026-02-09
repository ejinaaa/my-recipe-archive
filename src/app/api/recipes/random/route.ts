import { NextResponse } from 'next/server';
import { getRandomRecipe } from '@/entities/recipe/api/server';

export async function GET() {
  const recipe = await getRandomRecipe();
  return NextResponse.json(recipe);
}
