import { http, HttpResponse } from 'msw';
import { mockRecipes } from '@/entities/recipe/model/mock';
import { mockCategoryGroups } from '@/entities/category/model/mock';
import { mockProfile } from '@/entities/user/model/mock';
import {
  MOCK_COOK_COUNT,
  mockRecipeCookCounts,
} from '@/entities/cooking-log/model/mock';

/**
 * Storybook용 기본 MSW 핸들러
 * 12개 Route API 엔드포인트에 대한 성공 응답
 */
export const handlers = [
  // ── Recipes ──────────────────────────────────────────
  http.get('/api/recipes', ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const offset = Number(url.searchParams.get('offset') ?? '0');
    const sliced = mockRecipes.slice(offset, offset + limit);

    return HttpResponse.json({
      recipes: sliced,
      hasMore: offset + limit < mockRecipes.length,
    });
  }),

  http.get('/api/recipes/random', () => {
    return HttpResponse.json(mockRecipes[0]);
  }),

  http.get('/api/recipes/:id', ({ params }) => {
    const recipe = mockRecipes.find(r => r.id === params.id);
    if (!recipe) {
      return HttpResponse.json(null, { status: 404 });
    }
    return HttpResponse.json(recipe);
  }),

  // ── Categories ───────────────────────────────────────
  http.get('/api/categories/groups', () => {
    return HttpResponse.json(mockCategoryGroups);
  }),

  http.get('/api/categories/options', () => {
    const allOptions = mockCategoryGroups.flatMap(g => g.options);
    return HttpResponse.json(allOptions);
  }),

  http.get('/api/categories/options/:id', ({ params }) => {
    const allOptions = mockCategoryGroups.flatMap(g => g.options);
    const option = allOptions.find(o => o.id === Number(params.id));
    if (!option) {
      return HttpResponse.json(null, { status: 404 });
    }
    return HttpResponse.json(option);
  }),

  // ── Users ────────────────────────────────────────────
  http.get('/api/users/me', () => {
    return HttpResponse.json(mockProfile);
  }),

  http.get('/api/users/:id', () => {
    return HttpResponse.json(mockProfile);
  }),

  // ── Favorites ────────────────────────────────────────
  http.get('/api/favorites/status', () => {
    return HttpResponse.json(false);
  }),

  http.get('/api/favorites/statuses', () => {
    return HttpResponse.json({});
  }),

  // ── Cooking Logs ─────────────────────────────────────
  http.get('/api/cooking-logs/count', () => {
    return HttpResponse.json(MOCK_COOK_COUNT);
  }),

  http.get('/api/cooking-logs/user-counts', () => {
    return HttpResponse.json(mockRecipeCookCounts);
  }),
];
