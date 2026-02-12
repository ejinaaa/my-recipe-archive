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

`variant`, `size`, `colorScheme`, `disabled` 등 간단한 props:

```typescript
argTypes: {
  variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
  disabled: { control: 'boolean' },
}

export const Default: Story = {};  // 하나의 스토리에서 모든 조합 테스트
```

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

```typescript
title: 'shared/Button'
title: 'entities/recipe/RecipeCard'
title: 'features/recipe-search/SearchBar'
title: 'widgets/recipe-list/RecipeList'
title: 'views/recipe-detail/RecipeDetailPage'
```

## Mock 데이터 규칙

- `entities/{entity}/model/mock.ts`에서 import (**인라인 mock 금지**)
- mock.ts가 없는 엔티티는 `entities/{entity}/model/mock.ts` 생성 후 사용
  - `./types`에서 타입 import
  - `mock` 접두어 네이밍 (`mockProfile`, `mockRecipes` 등)
  - 상수 값은 `SCREAMING_SNAKE_CASE` (`MOCK_COOK_COUNT`)
  - 앱 톤앤매너에 맞는 한국어 데이터 사용
  - 필요한 필드만 최소한으로 작성 (optional 필드는 일부만)
  - 생성 후 `src/shared/mocks/handlers.ts`에도 해당 엔드포인트 핸들러 추가 검토

```typescript
// ✅ mock.ts에서 import
import { mockProfile } from '@/entities/user/model/mock';
queryClient.setQueryData(profileKeys.current(), mockProfile);

// ❌ 인라인 mock 금지
queryClient.setQueryData(profileKeys.current(), {
  id: 'user-1', nickname: '요리사',
});
```

## MSW + React Query 데이터 전략

`preview.tsx`에 글로벌 MSW 핸들러가 성공 응답을 반환하므로, 스토리별로 역할이 다름:

| 스토리 | 데이터 전략 | 이유 |
|--------|-----------|------|
| Default | `setQueryData` | SSR hydration 시뮬레이션 (suspend 없음) |
| Empty | `setQueryData` (빈 배열/null) | hydration + 빈 상태 |
| Loading | MSW `delay('infinite')` | 캐시 없음 → suspend → Suspense fallback |
| Error | MSW `HttpResponse 500` | 캐시 없음 → fetch 실패 → ErrorBoundary |
| MutationError | `setQueryData` + `ErrorBottomSheet` 직접 렌더 | 쿼리 정상, mutation 실패 UI만 |

### QueryClient 팩토리 패턴

```typescript
// 성공: staleTime: Infinity로 refetch 방지 + mock 데이터 세팅
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
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}
```

### profileKeys.current() 규칙

Loading/Error 스토리에서도 프로필은 항상 캐시에 세팅:

```typescript
// Loading/Error 에서도 프로필 캐시 필수
queryClient.setQueryData(profileKeys.current(), mockProfile);
```

이유: `useCurrentProfileQuery`는 `useQuery`(enabled 조건부)이므로, 캐시 없으면 추가 fetch 발생하여 의도치 않은 동작 유발.

### Infinite Query 데이터 형태

```typescript
queryClient.setQueryData(recipeKeys.infinite({}), {
  pages: [{ recipes: mockRecipes.slice(0, 6), hasMore: false }],
  pageParams: [0],
});
```

## Decorator 패턴

### Default/Empty: QueryClientProvider + Suspense

```typescript
decorators: [
  Story => {
    const queryClient = createSuccessQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<DetailSkeleton />}>
          <Story />
        </Suspense>
      </QueryClientProvider>
    );
  },
],
```

### Loading: MSW delay + Suspense 없음

컴포넌트 내부 Suspense boundary가 fallback을 표시하도록 Suspense를 감싸지 않음:

```typescript
parameters: {
  msw: {
    handlers: [
      http.get('/api/*', async () => {
        await delay('infinite');
      }),
    ],
  },
},
decorators: [
  Story => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    queryClient.setQueryData(profileKeys.current(), mockProfile);
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  },
],
```

### Error: MSW 500 응답

```typescript
parameters: {
  msw: {
    handlers: [
      http.get('/api/*', () => {
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 },
        );
      }),
    ],
  },
},
decorators: [
  Story => {
    const queryClient = createErrorQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  },
],
```

### MutationError: ErrorBottomSheet 직접 렌더

```typescript
decorators: [
  Story => {
    const queryClient = createSuccessQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FormSkeleton />}>
          <Story />
        </Suspense>
        <ErrorBottomSheet
          open
          onOpenChange={() => {}}
          onRetry={() => {}}
          onCancel={() => {}}
          title='레시피를 저장하지 못했어요'
          description='작성한 내용은 유지돼요. 다시 시도해주세요'
        />
      </QueryClientProvider>
    );
  },
],
```

### URL 상태 컴포넌트: NuqsTestingAdapter 래핑

`nuqs`(useQueryState)를 사용하는 컴포넌트는 `NuqsTestingAdapter`로 래핑:

```typescript
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';

decorators: [
  Story => {
    const queryClient = createSuccessQueryClient();
    return (
      <NuqsTestingAdapter>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<Skeleton />}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      </NuqsTestingAdapter>
    );
  },
],
```
