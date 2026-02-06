---
description: 컴포넌트 생성 원칙
globs: '**/shared/ui/**/*.tsx,**/entities/**/ui/**/*.tsx,**/features/**/ui/**/*.tsx,**/widgets/**/ui/**/*.tsx'
---

# 컴포넌트 설계 원칙

## 설계 철학

### 1. 합성 가능성 (Composability)

컴포넌트는 레고 블록처럼 조합 가능해야 한다. 작고 집중된 컴포넌트가 큰 복합 컴포넌트보다 낫다.

### 2. 예측 가능성 (Predictability)

같은 props → 같은 결과. 외부 상태에 암묵적으로 의존하지 않는다.

### 3. 재사용성 (Reusability)

특정 컨텍스트에 강결합된 컴포넌트는 재사용이 어렵다. 범용성을 고려하여 설계한다.

## 생성 전 체크리스트

1. **기존 컴포넌트 확인**: `shared/ui/`에 유사한 컴포넌트가 있는가?
2. **레이어 결정**: 이 컴포넌트가 속해야 할 FSD 레이어는?
3. **책임 범위**: 하나의 명확한 책임만 가지는가?

## 레이어별 설계 원칙

| 레이어 | 책임 | 의존성 |
|--------|------|--------|
| shared | 범용 UI 프리미티브 | 없음 (순수) |
| entities | 비즈니스 엔티티 표현 | shared만 |
| features | 사용자 인터랙션 | shared, entities |
| widgets | 복합 UI 블록 | shared, entities, features |
| views | 페이지 조합 | 모든 하위 레이어 |

### shared/ui

- **비즈니스 로직 금지**: 순수하게 UI만 담당
- **최대 유연성**: 다양한 상황에서 사용 가능하도록
- shadcn/ui 기반 + 프로젝트 디자인 시스템 적용

### features/widgets

- **Controlled Component**: 상태를 props로 제어
- **의존성 주입**: 외부 상태 소스에 직접 의존하지 않음
- **콜백 패턴**: 결과를 부모에게 위임

## Controlled Component 패턴

복잡한 인터랙션을 가진 컴포넌트(모달, 드로어, 폼)의 설계 원칙.

### 왜 Controlled인가?

| Uncontrolled | Controlled |
|--------------|------------|
| 내부에서 상태 관리 | 외부에서 상태 주입 |
| 테스트 시 모킹 필요 | props만으로 테스트 |
| 하나의 상태 소스에 강결합 | 다양한 상태 소스와 연결 가능 |

### Props 설계 패턴

```typescript
interface ControlledComponentProps {
  // 1. 제어 props - 열림/닫힘 상태
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // 2. 데이터 props - optional + 기본값
  initialValue?: T;
  defaultValue?: T;  // 또는 이름 선택

  // 3. 이벤트 콜백 - 결과 전달
  onApply: (value: T) => void;
  onCancel?: () => void;

  // 4. 변형 props - 동작 분기
  variant?: 'default' | 'compact';
  disabled?: boolean;
}
```

### 임시 상태 관리

사용자가 "적용" 전까지 변경을 미리보기할 때:

```typescript
function Editor({ open, initialValue, onApply }) {
  // 편집 중인 임시 상태 (draft)
  const [draft, setDraft] = useState(initialValue);

  // 열릴 때마다 초기값으로 리셋
  useEffect(() => {
    if (open) setDraft(initialValue);
  }, [open, initialValue]);

  // 적용 시에만 외부로 전달
  const handleApply = () => {
    onApply(draft);
    onOpenChange(false);
  };
}
```

## 확장성을 위한 설계

### Optional Props로 변형 지원

```typescript
// 기본 기능은 필수, 확장 기능은 선택
interface Props {
  onPrimary: () => void;       // 항상 필요
  onSecondary?: () => void;    // 있으면 추가 버튼 표시
  requireValidation?: boolean; // true면 검증 로직 활성화
}
```

### 기본값 전략

- 가장 일반적인 사용 사례를 기본값으로
- 기본값이 있으면 사용처에서 코드가 간결해짐
- `undefined`와 `null`의 의미를 구분 (필요시)

## 안티패턴

### 1. 외부 상태에 직접 의존

```typescript
// BAD
function Component() {
  const data = useGlobalStore();  // 강결합
}

// GOOD
function Component({ data }) {
  // 상태 소스와 무관
}
```

### 2. 과도한 props

10개 이상의 props → 컴포넌트 분리 또는 객체로 그룹화 검토

### 3. 조건부 렌더링 남용

3개 이상의 분기 → 별도 컴포넌트로 분리 검토

## 필수 산출물

- `[ComponentName].tsx` - 컴포넌트
- `[ComponentName].stories.tsx` - 스토리
- `index.ts` - public API export
