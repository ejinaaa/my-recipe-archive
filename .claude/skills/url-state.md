---
description: URL 상태 마이그레이션 — 전역 상태(Zustand 등)를 URL 쿼리 파라미터(nuqs)로 마이그레이션할 때 사용
---

# URL 상태 마이그레이션

전역 상태를 URL 쿼리 파라미터로 마이그레이션합니다.

## 사용법

```
/url-state [feature-name]
```

## 왜 URL 상태인가?

### URL의 장점

| 관점 | 이점 |
|------|------|
| **사용자 경험** | 링크 공유, 북마크, 뒤로가기 |
| **디버깅** | 상태가 URL에 명시적으로 노출 |
| **SEO** | 검색 엔진이 상태별 페이지 인덱싱 가능 |
| **테스트** | URL만으로 특정 상태 재현 가능 |

### URL로 이동해야 하는 상태

- 검색어, 필터, 정렬, 페이지네이션
- 탭/뷰 선택 상태
- 모달/드로어의 열림 상태 (딥링크 필요 시)

### URL로 이동하면 안 되는 상태

- 인증 토큰 등 민감 정보
- 폼 입력 중 임시값
- UI 애니메이션 상태

## 설계 원칙

### 1. Clean URL

기본값은 URL에서 생략한다.

```typescript
// ?sort=latest (기본값) → URL에서 생략
// ?sort=popular → URL에 표시

setParams({ sort: value === 'latest' ? null : value });
```

### 2. 단일 진실의 원천 (Single Source of Truth)

URL과 전역 상태에 같은 데이터가 중복되면 안 된다.

```typescript
// BAD: 동기화 필요, 버그 유발
const [urlQuery] = useQueryState('q');
const { query } = useStore();  // 어디가 진실?

// GOOD: URL이 유일한 원천
const { query } = useUrlQueryParams();
```

### 3. 컴포넌트와 상태 소스 분리

컴포넌트는 URL을 직접 알지 못하게 한다.

```typescript
// BAD: 컴포넌트가 URL에 직접 의존
function Filter() {
  const [params] = useQueryStates({ ... });
}

// GOOD: props로 추상화
function Filter({ initialValue, onApply }) {
  // URL 구조를 모름
}

// 페이지에서 연결
function Page() {
  const { filters, setFilters } = useUrlQueryParams();
  return <Filter initialValue={filters} onApply={setFilters} />;
}
```

## 워크플로우

### 1단계: 분석

대상 상태가 URL에 적합한지 판단:

- 공유/북마크 필요성
- 히스토리 복원 필요성
- 보안 민감도

### 2단계: URL 훅 설계

파라미터 이름, 타입, 기본값 정의:

```typescript
export function useUrlQueryParams() {
  const [params, setParams] = useQueryStates({
    q: parseAsString.withDefault(''),
    sort: parseAsStringEnum([...]).withDefault('latest'),
    page: parseAsInteger.withDefault(1),
  }, { shallow: true });

  // 읽기/쓰기 인터페이스 제공
  return { ... };
}
```

### 3단계: 컴포넌트 리팩토링

URL 의존성을 props로 대체:

- `initialValue` props 추가
- `onApply` 콜백 추가
- 내부 상태를 로컬 임시 상태로 변경

### 4단계: 페이지 연결

Views 레이어에서 URL 훅과 컴포넌트 연결.

### 5단계: 정리

- 기존 store에서 이동한 상태 제거
- 더 이상 사용하지 않는 훅/액션 삭제

## 검증 체크리스트

- [ ] URL 직접 입력 시 상태 반영
- [ ] 뒤로가기/앞으로가기 동작
- [ ] 새로고침 시 상태 유지
- [ ] 링크 공유 시 같은 화면 표시
- [ ] 기본값일 때 URL이 깔끔한지

## 기술적 요구사항

- `nuqs` 라이브러리 필요 (`pnpm add nuqs`)
- App Router: `<NuqsAdapter>` 래퍼
- 클라이언트 컴포넌트: `<Suspense>` 래퍼
