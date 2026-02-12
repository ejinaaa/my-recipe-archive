---
description: Storybook 스토리 작성 원칙 (CSF 3.0)
globs: '**/*.stories.tsx'
---

# Storybook 스토리 작성 원칙 (CSF 3.0)

## 기본 구조

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ComponentName } from './ComponentName';

const meta = {
  title: '[layer]/[segment]/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  args: { /* 기본 args */ },
  argTypes: { /* control 설정 */ },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

## 스토리 분리 원칙

### Control로 처리 (별도 스토리 X)

`variant`, `size`, `disabled` 등 간단한 props → `argTypes`로 control 설정

### 별도 스토리로 분리

- 복잡한 children 조합
- 데이터 edge case (긴 텍스트, 이미지 없음 등)
- Loading / Error / Empty 상태 (Widget/View)

## 컴포넌트 유형별 필수 스토리

| 유형 | Default | 추가 스토리 |
|------|---------|------------|
| UI Primitive | argTypes control 설정 | 복잡한 children |
| Entity | mock 데이터 사용 | edge case |
| Feature | fn() 액션 핸들러 | 특수 상태 |
| Widget | 기본 데이터 | Loading, Error, Empty |
| View | 기본 데이터 | Loading, Error, Empty, MutationError |

## Title 네이밍

`[layer]/[segment]/ComponentName` — 예: `shared/Button`, `entities/recipe/RecipeCard`, `views/recipe-detail/RecipeDetailPage`

## Mock 데이터 규칙

- `entities/{entity}/model/mock.ts`에서 import (**인라인 mock 금지**)
- mock.ts 없으면 생성: `mock` 접두어, `SCREAMING_SNAKE_CASE` 상수, 한국어 데이터
- 생성 후 `src/shared/mocks/handlers.ts`에 엔드포인트 핸들러 추가 검토

## MSW + React Query 데이터 전략

| 스토리 | QueryClient | Suspense | MSW parameters | 추가 요소 |
|--------|-----------|----------|----------------|----------|
| Default | Success | ✅ | — | — |
| Empty | Success (빈 데이터) | ✅ | — | — |
| Loading | Error + profile 캐시 | ❌ | `delay('infinite')` | — |
| Error | Error | ❌ | `HttpResponse 500` | — |
| MutationError | Success | ✅ | — | `ErrorBottomSheet` 직접 렌더 |

### QueryClient 팩토리 패턴

```typescript
// 성공: staleTime: Infinity + mock 데이터 세팅
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(recipeKeys.detail(id), mockRecipes[0]);
  queryClient.setQueryData(profileKeys.current(), mockProfile);
  return queryClient;
}

// 에러: retry: false만 (staleTime 없음 → 즉시 fetch → MSW 에러 응답)
function createErrorQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}
```

### 핵심 규칙

- **profileKeys.current()**: Loading/Error에서도 항상 캐시 세팅 (useQuery enabled 조건부이므로 캐시 없으면 의도치 않은 fetch 발생)
- **Infinite Query**: `{ pages: [...], pageParams: [0] }` 구조로 세팅
- **nuqs 사용 시**: 모든 decorator에 `NuqsTestingAdapter` 래핑

## Decorator 패턴

기본 구조 (Default/Empty):

```typescript
decorators: [
  Story => {
    const queryClient = createSuccessQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Skeleton />}>
          <Story />
        </Suspense>
      </QueryClientProvider>
    );
  },
],
```

**변형:**

| 스토리 | Decorator 차이점 |
|--------|----------------|
| Loading | `createErrorQueryClient()` + profile 캐시만 세팅, Suspense 없음, MSW `delay('infinite')` |
| Error | `createErrorQueryClient()`, Suspense 없음, MSW `HttpResponse.json({...}, { status: 500 })` |
| MutationError | `createSuccessQueryClient()`, `<Story />` 아래 `<ErrorBottomSheet open ... />` 추가 |
| URL 상태 | 전체를 `<NuqsTestingAdapter>`로 래핑 |
