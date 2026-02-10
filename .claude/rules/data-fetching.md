---
description: 데이터 페칭 패턴
globs: '**/api/**/*.ts'
---

# 데이터 페칭 패턴

## 5가지 패턴

| 패턴 | 파일 | 용도 |
|------|------|------|
| Server API | `server.ts` | SSR prefetch, Route API 내부 |
| Route API | `app/api/**/route.ts` | 클라이언트 데이터 조회 엔드포인트 |
| Client Fetch | `client.ts` | Route API 호출 (hooks queryFn) |
| Server Actions | `actions.ts` | mutation + revalidation (쓰기 전용) |
| React Query Hooks | `hooks.ts` | 클라이언트 상태 관리 |

## Entity API 파일 구조

```
entities/{entity}/api/
├── server.ts    # Supabase 직접 접근 (서버 전용)
├── client.ts    # Route API fetch 함수 (hooks queryFn)
├── actions.ts   # Server Actions (mutation 전용)
├── hooks.ts     # React Query hooks
└── keys.ts      # Query keys factory
```

## 읽기 패턴: prefetch + HydrationBoundary

### page.tsx (서버 컴포넌트)

```typescript
import { createServerQueryClient, dehydrate, HydrationBoundary } from '@/shared/lib/prefetch';
import { getRecipe } from '@/entities/recipe/api/server';
import { recipeKeys } from '@/entities/recipe/api/keys';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  // server.ts 함수로 직접 prefetch (Route API 아님!)
  await queryClient.prefetchQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipe(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeDetailPage id={id} />
    </HydrationBoundary>
  );
}
```

### 클라이언트 컴포넌트 (useSuspenseQuery)

```typescript
// 메인 콘텐츠 데이터 → useSuspenseQuery + Suspense/ErrorBoundary
export function RecipeDetailPage({ id }: { id: string }) {
  const { data: recipe } = useSuspenseRecipe(id);
  // data는 항상 존재 (Suspense가 로딩 처리)
}
```

### 클라이언트 컴포넌트 (useQuery)

```typescript
// 보조/조건부 데이터 → useQuery (enabled 옵션 필요)
export function FavoriteButton({ userId, recipeId }: Props) {
  const { data: isFavorited } = useIsFavorited(userId, recipeId);
  // enabled: !!userId && !!recipeId
}
```

## hooks 쿼리 분류

### useSuspenseQuery 사용 (prefetch + HydrationBoundary 필수)
- 페이지의 **메인 콘텐츠** 데이터
- `enabled` 옵션이 **필요 없는** 쿼리
- 예: `useSuspenseRecipe`, `useSuspenseInfiniteRecipes`, `useSuspenseCategoryGroups`

### useQuery 유지
- `enabled` 옵션이 **필요한** 조건부 쿼리
- 보조 데이터 (자체 로딩/에러 처리)
- 예: `useIsFavorited`, `useFavoriteStatuses`, `useProfile`, `useCurrentProfile`

## 쓰기 패턴: Server Actions

```typescript
// actions.ts - mutation 전용, 읽기 action 금지
'use server';
import { revalidatePath } from 'next/cache';

export async function createRecipeAction(data: RecipeInsert) {
  const recipe = await createRecipe(data);
  revalidatePath('/recipes');
  return recipe;
}
```

## Route API (client.ts queryFn용)

```typescript
// client.ts - Route API 호출 함수
import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { handleApiResponse } from '@/shared/api/fetchWithError';

export const fetchRecipe = async (id: string): Promise<Recipe | null> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/recipes/${id}`);
  if (res.status === 404) return null;
  return handleApiResponse<Recipe>(res, '레시피 정보를 가져오지 못했어요');
};
```

> 에러 처리 세부 패턴은 `error-handling.md` 참고

## 핵심 원칙

- **읽기는 Route API** (client.ts) → hooks queryFn으로 사용
- **쓰기는 Server Actions** (actions.ts) → mutation + revalidation
- **읽기용 Server Action 금지** → Route API로 대체
- **SSR에서 자기 자신 호출 금지** → prefetch는 server.ts 함수 직접 호출
- **prefetch + HydrationBoundary** → SSR 중 queryFn 실행 방지
