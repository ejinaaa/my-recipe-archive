---
description: 에러 처리 패턴
globs: '**/api/**/*.ts, **/ui/**/*.tsx, **/views/**/*.tsx'
---

# 에러 처리 패턴

## 에러 유형별 UI 패턴

| 에러 유형 | UI 패턴 | 컴포넌트 |
|----------|---------|---------|
| 쿼리 에러 (페이지 메인) | Skeleton + ErrorBottomSheet | `QueryErrorFallback` |
| 쿼리 에러 (Drawer 내부) | Inline Error UI | 직접 구현 |
| 쿼리 에러 (폼 필수 데이터) | 폼 영역 대체 Error UI | `ErrorFallback` |
| Mutation 에러 (retry 가능) | ErrorBottomSheet | `ErrorBottomSheet` |
| Mutation 에러 (권한/데이터 없음) | Toast 3초 auto-dismiss | `MutationCache` 자동 처리 |
| Mutation 에러 (기타) | Toast | `MutationCache` 자동 처리 |
| Mutation 에러 (비치명적) | 에러 무시 | `meta.suppressErrorToast` |
| 라우트 에러 | 전체 페이지 Error UI | `error.tsx`, `global-error.tsx` |
| 404 | Not Found 페이지 | `not-found.tsx` |

## 에러 처리 유틸리티

| 유틸리티 | 위치 | 용도 |
|---------|------|------|
| `ApiError` | `shared/api/fetchWithError.ts` | status 포함 에러 클래스 |
| `handleApiResponse` | `shared/api/fetchWithError.ts` | client.ts fetch 응답 공통 처리 |
| `handleRouteError` | `shared/api/handleRouteError.ts` | Route API catch 블록 공통 처리 |

## 쿼리 에러 패턴 (ErrorBoundary + Suspense)

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

## Mutation 에러 패턴 (ErrorBottomSheet)

페이지에서 직접 Bottom Sheet로 처리하는 mutation은 `meta.handleErrorManually` 설정.

```typescript
// hooks.ts — meta 설정
useMutation({
  mutationFn: createRecipeAction,
  meta: { handleErrorManually: true },
});

// Page.tsx — 에러 상태 + retry
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

## MutationCache 글로벌 에러 핸들러

`QueryProvider`의 `MutationCache.onError`가 모든 mutation 에러를 포착.
개별 mutation의 `meta`로 동작 분기:

| meta 옵션 | 동작 | 사용 예 |
|-----------|------|--------|
| `suppressErrorToast: true` | 에러 무시 (toast 없음) | `useIncrementViewCount`, `useAddCookingLog` |
| `handleErrorManually: true` | 글로벌 toast 건너뜀 (페이지에서 직접 처리) | `useCreateRecipe`, `useUpdateRecipe`, `useDeleteRecipe` |
| (없음) | 글로벌 toast 표시 | `useToggleFavorite` 등 나머지 |

## API 에러 처리

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

// 404 → null 패턴
export const fetchItem = async (id: string): Promise<Item | null> => {
  const res = await fetch(`${getBaseUrl()}/api/items/${id}`);
  if (res.status === 404) return null;
  return handleApiResponse<Item>(res, '정보를 가져오지 못했어요');
};
```

## 에러 메시지 톤앤매너

**공감 중심 문체** 사용. `~했습니다` 대신 `~했어요` 종결.

| 패턴 | 예시 |
|------|------|
| 조회 실패 | `~을(를) 가져오지 못했어요` |
| 생성 실패 | `~을(를) 저장하지 못했어요` / `추가하지 못했어요` |
| 수정 실패 | `~을(를) 수정하지 못했어요` |
| 삭제 실패 | `~을(를) 삭제하지 못했어요` |
| 네트워크 안내 | `네트워크 상태를 확인하고 다시 시도해주세요` |
| 내용 유지 안내 | `작성한 내용은 유지돼요. 다시 시도해주세요` |
| 404 | `~을(를) 찾을 수 없어요` |
| 파라미터 누락 | `필수 정보가 누락되었어요` |

```typescript
// ✅ 올바른 예
throw new Error('레시피 목록을 가져오지 못했어요');
throw new Error('즐겨찾기에 추가하지 못했어요');

// ❌ 사용 금지
throw new Error('레시피 목록을 불러오는데 실패했습니다.');
throw new Error('즐겨찾기 추가에 실패했습니다.');
```
