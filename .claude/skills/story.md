---
description: 스토리 생성 — 컴포넌트의 Storybook 스토리(.stories.tsx)를 자동 생성할 때 사용
---

# 스토리 생성

컴포넌트의 Storybook 스토리를 자동 생성합니다.

## 사용법

```
/story [컴포넌트 경로 또는 이름]
```

예시:
```
/story RecipeCard
/story src/shared/ui/button.tsx
```

## 워크플로우

### 1단계: 컴포넌트 분석

대상 컴포넌트 파일을 읽고 분석:
- 컴포넌트 이름
- Props 인터페이스
- variants (variant, size, colorScheme 등)
- 이벤트 핸들러 (onClick, onChange 등)
- FSD 레이어 위치

### 2단계: 컴포넌트 유형 판단

| 유형 | 레이어 | 스토리 특징 |
|------|--------|------------|
| UI Primitive | shared/ui | argTypes control 설정 |
| Entity | entities/*/ui | mock 데이터 필요 |
| Feature | features/*/ui | fn() 액션 핸들러 |
| Widget | widgets/*/ui | Loading/Error/Empty 필수 |
| View | views/*/ui | fullscreen layout, Loading/Error/Empty 필수 |

### 3단계: React Query 의존성 파악

컴포넌트와 **하위 컴포넌트**에서 사용하는 React Query 훅을 검색:

1. **훅 종류 확인** — 각 훅에 따라 스토리 세팅이 다름:

| 훅 | 캐시 세팅 | Suspense | 비고 |
|----|----------|----------|------|
| `useSuspenseQuery` | `setQueryData` 필수 | 필수 | 캐시 없으면 suspend |
| `useSuspenseInfiniteQuery` | `setQueryData` (pages 구조) 필수 | 필수 | `{ pages, pageParams }` |
| `useQuery` | `setQueryData` 권장 | 불필요 | enabled 조건 확인 |
| `useMutation` | - | - | MutationError 스토리 추가 검토 |

2. **query key → mock 데이터 매핑** — 사용되는 keys 함수와 대응하는 mock 데이터 파악

3. **mock 데이터 존재 여부 확인:**
   - `entities/{entity}/model/mock.ts` 존재 → import 하여 사용
   - **mock.ts가 없으면 생성:**
     - `entities/{entity}/model/types.ts`에서 타입 확인
     - 타입에 맞는 mock 데이터 작성
     - `mock` 접두어 네이밍 (`mockProfile`, `mockRecipes` 등)
     - 상수 값은 `SCREAMING_SNAKE_CASE` (`MOCK_COOK_COUNT`)
     - 앱 톤앤매너에 맞는 한국어 데이터, 필수 필드만 최소 작성
   - 생성 후 `src/shared/mocks/handlers.ts`에 해당 엔드포인트 핸들러 추가 검토

4. **`nuqs` (useQueryState) 사용 여부** — 사용 시 `NuqsTestingAdapter` 래핑 필요

React Query 훅을 사용하지 않으면 이 단계를 건너뛰고 4단계로 진행.

### 4단계: 스토리 파일 생성

`[ComponentName].stories.tsx` 생성:

1. CSF 3.0 형식으로 meta 작성
2. title을 FSD 레이어에 맞게 설정
3. 간단한 props는 argTypes로 control 설정

#### React Query 미사용 컴포넌트

4. 컴포넌트 유형에 맞는 스토리 추가 (Default, edge case 등)

#### React Query 사용 컴포넌트 (Widget/View)

4. Skeleton/fallback 컴포넌트 확인 또는 스토리 내부에 생성
5. QueryClient 팩토리 함수 작성:
   - `createSuccessQueryClient()` — `staleTime: Infinity` + mock 데이터 세팅
   - `createErrorQueryClient()` — `retry: false`만
6. 스토리 작성 순서:

| 스토리 | 데이터 전략 | Decorator |
|--------|-----------|-----------|
| Default | `setQueryData` | `QueryClientProvider` + `Suspense` |
| Empty | `setQueryData` (빈 배열/null) | Default와 동일 |
| Loading | MSW `delay('infinite')` | `QueryClientProvider` (Suspense 없음) |
| Error | MSW `HttpResponse 500` | `QueryClientProvider` (Suspense 없음) |
| MutationError | `setQueryData` + `ErrorBottomSheet` 직접 렌더 | Default + ErrorBottomSheet |

7. MSW 핸들러 작성 (`import { http, delay, HttpResponse } from 'msw'`):
   - Loading: `http.get('/api/*', async () => { await delay('infinite') })`
   - Error: `http.get('/api/*', () => HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 }))`
   - Default에서는 MSW 설정 불필요 (글로벌 핸들러가 성공 응답 제공)

8. `profileKeys.current()` — Loading/Error에서도 프로필 캐시 필수 세팅
9. `nuqs` 사용 시 모든 decorator에 `NuqsTestingAdapter` 래핑

### 5단계: 검증

```bash
pnpm storybook
```

스토리북에서 렌더링 확인
