---
description: Data fetching patterns
globs: '**/api/**/*.ts'
---

# Data Fetching Patterns

## 5 Patterns

| Pattern | File | Purpose |
|---------|------|---------|
| Server API | `server.ts` | SSR prefetch, inside Route API |
| Route API | `app/api/**/route.ts` | Client data query endpoints |
| Client Fetch | `client.ts` | Route API calls (hooks queryFn) |
| Server Actions | `actions.ts` | Mutation + revalidation (write-only) |
| React Query Hooks | `hooks.ts` | Client state management |

## Entity API File Structure

```
entities/{entity}/api/
├── server.ts    # Direct Supabase access (server-only)
├── client.ts    # Route API fetch functions (hooks queryFn)
├── actions.ts   # Server Actions (mutation-only)
├── hooks.ts     # React Query hooks
└── keys.ts      # Query keys factory
```

## Read Pattern: prefetch + HydrationBoundary

### page.tsx (Server Component)

```typescript
import { createServerQueryClient, dehydrate, HydrationBoundary } from '@/shared/lib/prefetch';
import { getRecipeApi } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  // Prefetch directly with server.ts function (NOT Route API!)
  await queryClient.prefetchQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipeApi(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeDetailPage id={id} />
    </HydrationBoundary>
  );
}
```

### Client Component (useSuspenseQuery)

```typescript
// Main content data → useSuspenseQuery + Suspense/ErrorBoundary
export function RecipeDetailPage({ id }: { id: string }) {
  const { data: recipe } = useSuspenseRecipeQuery(id);
  // data always exists (Suspense handles loading)
}
```

### Client Component (useQuery)

```typescript
// Auxiliary/conditional data → useQuery (needs enabled option)
export function FavoriteButton({ userId, recipeId }: Props) {
  const { data: isFavorited } = useIsFavoritedQuery(userId, recipeId);
  // enabled: !!userId && !!recipeId
}
```

## Hook Query Classification

### useSuspenseQuery (prefetch + HydrationBoundary required)
- **Main content** data for the page
- Queries that **don't need** `enabled` option
- e.g., `useSuspenseRecipeQuery`, `useSuspenseInfiniteRecipesQuery`, `useSuspenseCategoryGroupsQuery`

### useQuery (keep as-is)
- **Conditional** queries that **need** `enabled` option
- Auxiliary data (self-managed loading/error)
- e.g., `useIsFavoritedQuery`, `useFavoriteStatusesQuery`, `useProfileQuery`, `useCurrentProfileQuery`

## Write Pattern: Server Actions

```typescript
// actions.ts - mutation-only, NO read actions
'use server';
import { revalidatePath } from 'next/cache';

export async function createRecipeAction(data: RecipeInsert) {
  const recipe = await createRecipeApi(data);
  revalidatePath('/recipes');
  return recipe;
}
```

## Route API (for client.ts queryFn)

```typescript
// client.ts - Route API fetch functions
import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { handleApiResponse } from '@/shared/api/fetchWithError';

export const fetchRecipe = async (id: string): Promise<Recipe | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/recipes/${id}`);
  if (res.status === 404) return null;
  return handleApiResponse<Recipe>(res, '레시피 정보를 가져오지 못했어요');
};
```

> See `error-handling.md` for detailed error handling patterns

## Core Principles

- **Reads use Route API** (client.ts) → used as hooks queryFn
- **Writes use Server Actions** (actions.ts) → mutation + revalidation
- **No read Server Actions** → use Route API instead
- **No self-calls in SSR** → prefetch calls server.ts functions directly
- **prefetch + HydrationBoundary** → prevents queryFn execution during SSR
