---
description: 테스트 생성 — 함수, 훅의 Vitest 테스트 파일을 자동 생성할 때 사용. TDD 워크플로우 지원.
---

# 테스트 생성

대상 코드를 분석하고 Vitest 테스트 파일을 생성합니다.

## 사용법

```
/test [파일 경로 또는 함수명]
```

예시:

```
/test src/entities/recipe/model/utils.ts
/test toggleCategoryFilter
```

## 모드 판단

| 조건 | 모드 |
|------|------|
| 기존 코드에 테스트 추가 | **모드 A** (테스트 추가) |
| 사용자가 "TDD" 언급 | **모드 B** (TDD) |
| 새 함수/훅을 처음부터 작성 | **모드 B** (TDD) |

---

## 모드 A: 기존 코드에 테스트 추가

### 1단계: 대상 분석

대상 파일을 읽고 분석:

- 함수/훅의 시그니처 (입출력 타입)
- 분기 조건 (`if`, 삼항, `switch`)
- Edge case (빈 배열, null/undefined, 경계값)
- 외부 의존성 (React Query, URL 상태 등)

### 2단계: 테스트 유형 결정

| 대상 | 테스트 유형 | 필요 도구 |
|------|-----------|----------|
| 순수 함수 (`model/utils.ts`, `shared/lib/`) | 유닛 테스트 | Vitest |
| React Query 훅 (`api/hooks.ts`) | 훅 테스트 | Vitest + `@testing-library/react` |
| URL 상태 훅 (`useUrlQueryParams`) | 훅 테스트 | Vitest + `nuqs/adapters/testing` |
| UI 컴포넌트 인터랙션 | **Storybook play function** | `/story` 워크플로우로 안내 |

### 3단계: mock 데이터 확인

1. `entities/{entity}/model/mock.ts` 존재 확인
2. 필요한 mock이 없으면 `mock.ts`에 추가
3. DB 레벨 mock 필요 시 `mockXxxDB` 네이밍으로 추가

### 4단계: 테스트 케이스 설계

각 함수/훅에 대해:

- **정상 케이스**: 대표적인 입력 → 기대 출력
- **Edge case**: 빈 값, null, 경계값, 긴 문자열
- **에러 케이스**: 잘못된 입력, 실패 시나리오

테스트 케이스 목록을 먼저 정리한 뒤 사용자에게 확인.

### 5단계: 테스트 파일 생성

co-located `*.test.ts` 파일 생성:

```typescript
import { describe, expect, it } from 'vitest';
import { targetFunction } from './utils';
import { mockData } from './mock';

describe('targetFunction', () => {
  it('정상 동작을 설명한다', () => {
    // Arrange - Act - Assert
  });
});
```

### 6단계: 실행 및 검증

```bash
pnpm vitest run [파일경로]
```

실패하는 테스트가 있으면 원인 분석 후 수정.

---

## 모드 B: TDD (새 코드 작성)

### 1단계: 요구사항 분석

사용자의 요구사항을 분석하여 테스트 케이스 도출:

- 함수/훅의 이름과 시그니처 결정
- 입출력 타입 정의
- 정상/Edge/에러 케이스 목록화
- 테스트 케이스를 사용자에게 확인

### 2단계: Red — 실패하는 테스트 작성

1. 소스 파일에 **빈 함수 stub** 생성 (타입만 맞춤)
2. `*.test.ts` 파일에 **첫 번째 테스트 케이스** 작성
3. 테스트 실행하여 실패 확인

```typescript
// utils.ts — 빈 stub
export const formatCookingTime = (minutes: number): string => {
  throw new Error('Not implemented');
};

// utils.test.ts — 실패하는 테스트
it('60분 미만이면 분 단위로 표시한다', () => {
  expect(formatCookingTime(30)).toBe('30분');
});
```

### 3단계: Green — 최소 구현

테스트를 통과하는 **최소한의** 코드 작성:

- 하드코딩도 허용 (다음 테스트가 일반화를 강제)
- 과도한 추상화 금지

### 4단계: Refactor

테스트가 통과하는 상태에서:

- 중복 코드 제거
- 가독성 개선
- 네이밍 개선

### 5단계: 반복

다음 테스트 케이스로 2~4단계 반복:

- 한 번에 하나의 테스트 케이스만 추가
- 각 사이클마다 테스트 실행하여 통과 확인
- 모든 케이스 완료 시 전체 테스트 실행

---

## 주의사항

- `@testing-library/react` 미설치 시 훅 테스트 전에 설치 안내
- `vitest.config.ts` 미설정 시 실행 전에 설정 안내
- 컴포넌트 UI 테스트 요청 시 Storybook play function으로 안내
- 테스트 파일에서도 프로젝트 코드 스타일 유지 (type-only import 등)
