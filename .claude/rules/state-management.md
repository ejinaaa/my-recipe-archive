---
description: 상태 관리 패턴
globs: '**/model/**/*.ts,**/ui/**/*.tsx'
---

# 상태 관리 패턴

## 핵심 원칙

### 1. 상태의 범위를 최소화하라

상태는 가능한 가장 좁은 범위에서 관리한다. 불필요하게 넓은 범위의 상태는 복잡성을 높이고 예측 불가능한 버그를 유발한다.

```
로컬 상태 → 컴포넌트 간 공유 → 전역 상태 → URL 상태
(좁음)                                      (넓음)
```

### 2. 상태 위치는 사용 목적에 따라 결정하라

| 질문 | Yes → |
|------|-------|
| URL 공유 시 같은 화면이 보여야 하는가? | URL 상태 |
| 브라우저 히스토리로 복원되어야 하는가? | URL 상태 |
| 여러 컴포넌트에서 동시에 접근하는가? | 전역 상태 |
| 단일 컴포넌트에서만 사용하는가? | 로컬 상태 |

### 3. 상태와 UI를 분리하라 (SRP)

컴포넌트는 **UI 렌더링**에만 집중하고, 상태 소스(URL, Store)에 대한 의존성은 외부에서 주입받는다.

```typescript
// BAD: 컴포넌트가 상태 소스를 알고 있음
function Component() {
  const data = useGlobalStore();  // 전역 상태에 강결합
}

// GOOD: 컴포넌트는 props만 알고 있음
function Component({ data, onChange }) {
  // 상태 소스와 무관하게 동작
}
```

## 상태 유형별 가이드

### URL 상태

**사용 시점:**
- 검색/필터/정렬/페이지네이션
- 딥링크로 특정 상태에 접근해야 할 때
- 사용자가 뒤로가기로 이전 상태를 복원할 때

**설계 원칙:**
- 기본값은 URL에서 생략 (clean URL)
- 타입 안전한 파싱 (`nuqs` 권장)
- 훅으로 추상화하여 사용처에서 URL 구조 은닉

### 로컬 상태

**사용 시점:**
- 모달/드로어 열림 상태
- 폼 입력 중 임시값 (제출 전)
- 애니메이션/트랜지션 상태
- hover/focus 등 순수 UI 상태

**설계 원칙:**
- 컴포넌트와 생명주기를 같이함
- 부모로 끌어올리기 전 정말 필요한지 검토

### 전역 상태

**사용 시점:**
- 인증 정보 (로그인 상태, 사용자 정보)
- 앱 설정 (테마, 언어)
- 크로스 커팅 관심사

**설계 원칙:**
- 전역 상태는 **마지막 수단**
- URL로 대체 가능하면 URL 사용
- 서버 상태는 React Query로 관리

## 컴포넌트 설계 패턴

### Controlled Component 패턴

복잡한 UI 컴포넌트(모달, 드로어, 폼)는 **제어 컴포넌트**로 설계:

```typescript
interface Props {
  // 1. 제어 props
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // 2. 초기값 (optional + 기본값)
  initialValue?: T;

  // 3. 결과 콜백
  onApply: (value: T) => void;
}
```

**장점:**
- **테스트 용이성**: 모킹 없이 props만으로 테스트
- **재사용성**: 다양한 상태 소스와 연결 가능
- **예측 가능성**: 데이터 흐름이 명확

### 임시 상태 패턴

사용자가 "적용" 전까지 변경사항을 미리보기할 때:

```typescript
function Editor({ initialValue, onApply }) {
  // 편집 중인 임시 상태
  const [draft, setDraft] = useState(initialValue);

  // 열릴 때 초기값 동기화
  useEffect(() => {
    if (open) setDraft(initialValue);
  }, [open, initialValue]);

  // 적용 시에만 외부로 전달
  const handleApply = () => onApply(draft);
}
```

## 안티패턴

### 1. 과도한 전역 상태

```typescript
// BAD: 모든 상태를 전역으로
const useStore = create((set) => ({
  isModalOpen: false,      // 로컬이어야 함
  searchQuery: '',         // URL이어야 함
  currentPage: 1,          // URL이어야 함
}));
```

### 2. Prop Drilling 회피를 위한 전역화

```typescript
// BAD: 2-3단계 전달이 귀찮아서 전역화
// GOOD: 컴포넌트 합성, Context, 또는 구조 재설계
```

### 3. 상태 소스 혼합

```typescript
// BAD: 같은 데이터가 URL과 Store에 중복
const [urlQuery] = useQueryState('q');
const { query } = useStore();  // 어디가 진실?
```

## 마이그레이션 가이드

전역 상태 → URL 상태 이동 시:

1. 해당 상태가 URL에 적합한지 검토 (공유/히스토리 필요성)
2. URL 훅 생성 및 파서 정의
3. 컴포넌트를 순수 UI로 리팩토링
4. 페이지에서 URL 훅 사용 및 props 연결
5. 기존 store에서 해당 상태 제거
