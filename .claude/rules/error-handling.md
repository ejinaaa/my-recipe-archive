---
description: Error handling patterns
globs: '**/api/**/*.ts, **/ui/**/*.tsx, **/views/**/*.tsx'
---

# Error Handling Patterns

## Error Type → UI Pattern

| Error Type | UI Pattern | Component |
|-----------|---------|---------|
| Query error (page main) | Skeleton + ErrorBottomSheet | `QueryErrorFallback` |
| Query error (inside Drawer) | Inline Error UI | Custom implementation |
| Query error (form required data) | Error UI replacing form area | `ErrorFallback` |
| Mutation error (retryable) | ErrorBottomSheet | `ErrorBottomSheet` |
| Mutation error (auth/data missing) | Toast 3s auto-dismiss | `MutationCache` auto-handled |
| Mutation error (other) | Toast | `MutationCache` auto-handled |
| Mutation error (non-critical) | Ignore error | `meta.suppressErrorToast` |
| Route error | Full-page Error UI | `error.tsx`, `global-error.tsx` |
| 404 | Not Found page | `not-found.tsx` |

## Error Handling Utilities

| Utility | Location | Purpose |
|---------|------|------|
| `ApiError` | `shared/api/fetchWithError.ts` | Error class with status |
| `handleApiResponse` | `shared/api/fetchWithError.ts` | Common client.ts fetch response handler |
| `handleRouteError` | `shared/api/handleRouteError.ts` | Common Route API catch block handler |

## Query Error Pattern (ErrorBoundary + Suspense)

```typescript
<ErrorBoundary fallbackRender={({ resetErrorBoundary }) => (
  <QueryErrorFallback
    skeleton={<RecipeListSkeleton />}
    onRetry={resetErrorBoundary}
    onHome={() => router.push(ROUTES.RECIPES.LIST)}
    title="레시피 목록을 가져오지 못했어요"
    description="네트워크 상태를 확인하고 다시 시도해주세요"
  />
)}>
  <Suspense fallback={<RecipeListSkeleton />}>
    <ComponentWithQuery />
  </Suspense>
</ErrorBoundary>
```

## Mutation Error Pattern (ErrorBottomSheet)

For mutations handled directly via Bottom Sheet on the page, set `meta.handleErrorManually`.

```typescript
// hooks.ts — meta configuration
useMutation({
  mutationFn: createRecipeAction,
  meta: { handleErrorManually: true },
});

// Page.tsx — error state + retry
const [mutationError, setMutationError] = useState<{ retry: () => void } | null>(null);

const handleSubmit = async (formData) => {
  try {
    await createRecipe.mutateAsync(data);
  } catch {
    setMutationError({ retry: () => handleSubmit(formData) });
  }
};

<ErrorBottomSheet
  open={!!mutationError}
  onOpenChange={open => !open && setMutationError(null)}
  onRetry={() => { mutationError?.retry(); setMutationError(null); }}
  onCancel={() => setMutationError(null)}
  title="레시피를 저장하지 못했어요"
  description="작성한 내용은 유지돼요. 다시 시도해주세요"
/>
```

## MutationCache Global Error Handler

`QueryProvider`'s `MutationCache.onError` catches all mutation errors.
Behavior branches based on individual mutation `meta`:

| meta Option | Behavior | Example |
|-----------|------|--------|
| `suppressErrorToast: true` | Ignore error (no toast) | `useIncrementViewCountMutation`, `useAddCookingLogMutation` |
| `handleErrorManually: true` | Skip global toast (page handles directly) | `useCreateRecipeMutation`, `useUpdateRecipeMutation`, `useDeleteRecipeMutation` |
| (none) | Show global toast | `useToggleFavoriteMutation` etc. |

## API Error Handling

### Route API (`app/api/**/route.ts`)

```typescript
import { handleRouteError } from '@/shared/api/handleRouteError';

export async function GET() {
  try {
    const data = await getData();
    return Response.json(data);
  } catch (error) {
    return handleRouteError(error, 'GET /api/endpoint');
  }
}
```

### Client Fetch (`entities/{entity}/api/client.ts`)

```typescript
import { handleApiResponse } from '@/shared/api/fetchWithError';

export const fetchData = async (): Promise<Data> => {
  const res = await fetch(`${getBaseUrl()}/api/endpoint`);
  return handleApiResponse<Data>(res, '데이터를 가져오지 못했어요');
};

// 404 → null pattern
export const fetchItem = async (id: string): Promise<Item | null> => {
  const res = await fetch(`${getBaseUrl()}/api/items/${id}`);
  if (res.status === 404) return null;
  return handleApiResponse<Item>(res, '정보를 가져오지 못했어요');
};
```

## Error Message Tone

**Empathetic tone** — use `~했어요` endings (not formal `~했습니다`).

| Pattern | Example |
|------|------|
| Fetch failure | `~을(를) 가져오지 못했어요` |
| Create failure | `~을(를) 저장하지 못했어요` / `추가하지 못했어요` |
| Update failure | `~을(를) 수정하지 못했어요` |
| Delete failure | `~을(를) 삭제하지 못했어요` |
| Network guide | `네트워크 상태를 확인하고 다시 시도해주세요` |
| Content preserved | `작성한 내용은 유지돼요. 다시 시도해주세요` |
| 404 | `~을(를) 찾을 수 없어요` |
| Missing params | `필수 정보가 누락되었어요` |

```typescript
// ✅ Correct
throw new Error('레시피 목록을 가져오지 못했어요');
throw new Error('즐겨찾기에 추가하지 못했어요');

// ❌ Forbidden
throw new Error('레시피 목록을 불러오는데 실패했습니다.');
throw new Error('즐겨찾기 추가에 실패했습니다.');
```
