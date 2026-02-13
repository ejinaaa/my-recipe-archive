---
description: Test writing patterns
globs: '**/*.test.ts,**/*.test.tsx'
---

# Test Writing Patterns

## Test Strategy

| Test Type | Target | Tool | File |
|-----------|--------|------|------|
| Unit test | Utility functions, transform functions, pure logic | Vitest | `*.test.ts` |
| Hook test | Custom hooks (React Query, URL state) | Vitest + `renderHook` | `*.test.ts` |
| Component test | UI interaction | Storybook play function | `*.stories.tsx` |

> See `storybook.md` for component interaction tests. This rule focuses on Vitest unit/hook tests.

## TDD (Test-Driven Development)

### TDD Criteria

Use TDD when ROI is high:

- Complex business logic (multiple branches, state transitions)
- Data transform functions (`toRecipe`, `groupCategoriesByType` etc.)
- Functions with many edge cases
- Bug fixes (write failing test first → fix)

TDD not needed:

- Simple wrappers (1-line type conversion functions)
- UI rendering (verified via Storybook)
- External API calls (`server.ts`, `actions.ts`)

### Red-Green-Refactor Cycle

1. **Red**: Write a failing test (define expected behavior)
2. **Green**: Write **minimal** code to pass the test
3. **Refactor**: Remove duplication, improve readability (keep tests passing)

```typescript
// 1. Red — test first
it('60분 이상이면 시간+분으로 변환한다', () => {
  expect(formatCookingTime(90)).toBe('1시간 30분');
});

// 2. Green — minimal implementation
export const formatCookingTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
};

// 3. Refactor — improve if needed
```

### Create Test File First in TDD

When writing new functions/hooks:

1. Create `*.test.ts` file first
2. Define expected behavior with `describe` + `it`
3. Create source file and implement
4. Verify tests pass
5. Refactor

## Test Target Criteria

### Should Write Tests

- `model/utils.ts` — transform/calculation functions
- `model/constants.ts` — constant-based helper functions
- `shared/lib/*.ts` — shared utilities
- `api/hooks.ts` — React Query hooks (queryKey, enabled conditions, optimistic update)
- Functions with complex conditional branching

### No Tests Needed

- Type-only files (`types.ts`)
- Simple re-exports (`index.ts`)
- Direct Supabase calls (`server.ts`) — integration test domain
- Server Actions (`actions.ts`) — E2E test domain
- Pure UI rendering — covered by Storybook stories

## File Placement

Co-locate with source file in the **same directory**:

```
model/
├── utils.ts
├── utils.test.ts    ← co-located
├── types.ts
└── constants.ts
```

## Naming

- `describe`: Function name or hook name
- `it`: Describe behavior in **Korean** (`~한다`, `~된다`)
- One assertion per test principle (related assertions allowed)

## Unit Test Pattern

### Arrange-Act-Assert

```typescript
it('새 카테고리를 추가한다', () => {
  // Arrange
  const filters = { situation: ['daily'], cuisine: [], dishType: [] };

  // Act
  const result = toggleCategoryFilter(filters, 'cuisine', 'korean');

  // Assert
  expect(result.cuisine).toEqual(['korean']);
});
```

## Hook Test Patterns

### React Query Hook (QueryClientProvider wrapper)

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

function createWrapper() {
  const queryClient = createTestQueryClient();
  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
}
```

### Query Hook — enabled Condition Verification

```typescript
it('userId가 없으면 쿼리를 실행하지 않는다', () => {
  const { queryClient, wrapper } = createWrapper();
  renderHook(() => useIsFavoritedQuery(undefined, 'recipe-1'), { wrapper });
  expect(queryClient.isFetching()).toBe(0);
});
```

### Mutation Hook — Optimistic Update Verification

```typescript
it('즐겨찾기 토글 시 캐시를 즉시 업데이트한다', async () => {
  const { queryClient, wrapper } = createWrapper();
  queryClient.setQueryData(favoriteKeys.status('user-1', 'recipe-1'), false);
  const { result } = renderHook(() => useToggleFavoriteMutation(), { wrapper });
  result.current.mutate({ userId: 'user-1', recipeId: 'recipe-1' });
  await waitFor(() => {
    expect(queryClient.getQueryData(favoriteKeys.status('user-1', 'recipe-1'))).toBe(true);
  });
});
```

## Mock Rules

- Reuse existing `entities/{entity}/model/mock.ts` (**no inline mocks**)
- When DB-level mocks are needed, add `mockRecipeDB` etc. to `mock.ts`
