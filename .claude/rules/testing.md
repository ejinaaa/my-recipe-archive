---
description: 테스트 작성 패턴
globs: '**/*.test.ts,**/*.test.tsx'
---

# 테스트 작성 패턴

## 테스트 전략

| 테스트 유형 | 대상 | 도구 | 파일 |
|------------|------|------|------|
| 유닛 테스트 | 유틸 함수, 변환 함수, 순수 로직 | Vitest | `*.test.ts` |
| 훅 테스트 | 커스텀 훅 (React Query, URL 상태) | Vitest + `renderHook` | `*.test.ts` |
| 컴포넌트 테스트 | UI 인터랙션 | Storybook play function | `*.stories.tsx` |

> 컴포넌트 인터랙션 테스트는 `storybook.md` 참고. 이 rule은 Vitest 유닛/훅 테스트에 집중.

## TDD (Test-Driven Development)

### TDD 적용 기준

ROI가 높은 경우에 TDD로 진행:

- 복잡한 비즈니스 로직 (다중 분기, 상태 변환)
- 데이터 변환 함수 (`toRecipe`, `groupCategoriesByType` 등)
- Edge case가 많은 함수
- 버그 수정 (실패 테스트 먼저 → 수정)

TDD 불필요:

- 단순 wrapper (타입 변환만 하는 1줄 함수)
- UI 렌더링 (Storybook으로 검증)
- 외부 API 호출 (`server.ts`, `actions.ts`)

### Red-Green-Refactor 사이클

1. **Red**: 실패하는 테스트 작성 (기대 동작 정의)
2. **Green**: 테스트를 통과하는 **최소한의** 코드 작성
3. **Refactor**: 중복 제거, 가독성 개선 (테스트 통과 유지)

```typescript
// 1. Red — 테스트 먼저
it('60분 이상이면 시간+분으로 변환한다', () => {
  expect(formatCookingTime(90)).toBe('1시간 30분');
});

// 2. Green — 최소 구현
export const formatCookingTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
};

// 3. Refactor — 필요 시 개선
```

### TDD 시 테스트 파일 먼저 생성

새 함수/훅 작성 시:

1. `*.test.ts` 파일 먼저 생성
2. `describe` + `it`으로 기대 동작 정의
3. 소스 파일 생성 및 구현
4. 테스트 통과 확인
5. 리팩터링

## 테스트 대상 기준

### 작성 대상

- `model/utils.ts` — 변환/계산 함수
- `model/constants.ts` — 상수 기반 헬퍼 함수
- `shared/lib/*.ts` — 공유 유틸리티
- `api/hooks.ts` — React Query 훅 (queryKey, enabled 조건, optimistic update)
- 복잡한 조건 분기가 있는 함수

### 작성 불필요

- 타입 정의만 있는 파일 (`types.ts`)
- 단순 re-export (`index.ts`)
- Supabase 직접 호출 (`server.ts`) — 통합 테스트 영역
- Server Actions (`actions.ts`) — E2E 테스트 영역
- 순수 UI 렌더링 — Storybook 스토리로 커버

## 파일 배치

소스 파일과 **같은 디렉토리**에 co-locate:

```
model/
├── utils.ts
├── utils.test.ts    ← co-located
├── types.ts
└── constants.ts
```

## 네이밍

- `describe`: 함수명 또는 훅명
- `it`: **한글**로 동작 설명 (`~한다`, `~된다`)
- 테스트 당 하나의 assertion 원칙 (관련 assertions는 허용)

## 유닛 테스트 패턴

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

## 훅 테스트 패턴

### React Query 훅 (QueryClientProvider wrapper)

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

### Query 훅 — enabled 조건 검증

```typescript
it('userId가 없으면 쿼리를 실행하지 않는다', () => {
  const { queryClient, wrapper } = createWrapper();
  renderHook(() => useIsFavoritedQuery(undefined, 'recipe-1'), { wrapper });
  expect(queryClient.isFetching()).toBe(0);
});
```

### Mutation 훅 — optimistic update 검증

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

## Mock 규칙

- 기존 `entities/{entity}/model/mock.ts` 재사용 (**인라인 mock 금지**)
- DB 레벨 mock 필요 시 `mock.ts`에 `mockRecipeDB` 등 추가
