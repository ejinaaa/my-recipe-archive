--- Cursor Command: validate-ui ---

# UI 검증 및 최적화

구현된 UI가 디자인 시스템과 FSD 아키텍처를 준수하는지 검증합니다.

## 1단계: 대상 파일 확인

검증할 파일을 선택:

- 사용자가 지정한 파일
- 현재 열린 .tsx 파일들
- 최근 수정된 UI 컴포넌트

## 2단계: 디자인 시스템 검증

### Typography 검사

```typescript
// ❌ 발견된 문제
<h1 className="text-2xl font-bold">제목</h1>
<p className="text-base">본문</p>

// ✅ 수정 제안
<h1 className="text-heading-1">제목</h1>
<p className="text-body-1">본문</p>
```

파일에서 다음 패턴 검색:

- `text-\d+xl`, `text-base`, `text-sm` 등
- `font-bold`, `font-semibold` 등
  → 커스텀 typography 클래스로 교체 제안

### Color 검사

```typescript
// ❌ 발견된 문제
<div className="bg-red-500 text-gray-900">
<span className="text-blue-600">

// ✅ 수정 제안
<div className="bg-primary-base text-text-primary">
<span className="text-primary-base">
```

파일에서 다음 패턴 검색:

- `bg-red-\d+`, `bg-blue-\d+`, `bg-gray-\d+` 등
- `text-red-\d+`, `text-gray-\d+` 등
  → 정의된 컬러 팔레트로 교체 제안

### Spacing 검사

일관된 spacing 사용 확인:

- gap-1/2/3/4 (4px, 8px, 12px, 16px)
- p-1/2/3/4, m-1/2/3/4
- 임의의 값 (gap-5, p-7 등) 사용 시 경고

## 3단계: FSD 아키텍처 검증

### 레이어 배치 확인

```typescript
// ❌ 발견된 문제
// views/recipes/ui/RecipeList.tsx - 복잡한 로직 포함
export function RecipeList() {
  const [data, setData] = useState([]);
  useEffect(() => {
    /* 데이터 fetching */
  }, []);
  // ... 100줄의 로직
}

// ✅ 수정 제안
// widgets/recipe-list로 이동 제안
// views는 조합만 담당해야 함
```

각 레이어별 검사:

- **views**: 100줄 이상 또는 복잡한 로직 → widgets/features로 분리 제안
- **features**: 여러 기능 혼재 → 단일 책임으로 분리 제안
- **widgets**: features를 import → 레이어 규칙 위반 경고

### Import 규칙 검증

```typescript
// ❌ 발견된 문제
// features/recipe-search에서
import { RecipeList } from '@/widgets/recipe-list'; // 하위가 상위 import

// features/user-auth에서
import { RecipeSearch } from '@/features/recipe-search'; // 같은 레이어 import

// ✅ 수정 제안
- 컴포넌트를 shared나 entities로 이동
- 또는 아키텍처 재설계
```

## 4단계: 컴포넌트 품질 검증

### Props 인터페이스

```typescript
// ❌ 발견된 문제
export function Button({ onClick, children, className }) {
  // Props 타입 정의 없음
}

// ✅ 수정 제안
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  colorScheme?: 'primary' | 'secondary' | 'neutral';
}

export function Button({
  variant = 'solid',
  colorScheme = 'primary',
  onClick,
  children,
  className,
  ...props
}: ButtonProps) {
  // 명확한 타입 정의
}
```

확인 사항:

- Props 인터페이스 존재?
- 적절한 타입 확장? (HTMLAttributes 등)
- Default props 정의?

### 접근성 (Accessibility)

```typescript
// ❌ 발견된 문제
<button onClick={handleClick}>
  <X />
</button>

// ✅ 수정 제안
<button onClick={handleClick} aria-label="닫기">
  <X />
</button>
```

확인 사항:

- 아이콘 버튼에 aria-label?
- 이미지에 alt?
- form input에 label?

### 재사용 가능성

```typescript
// ❌ 발견된 문제
// 하드코딩된 값
<button className="px-4 py-2 bg-blue-500 rounded-full">
  확인
</button>

// ✅ 수정 제안
// shared/ui/Button 컴포넌트 사용
<Button variant="solid" colorScheme="primary">
  확인
</Button>
```

## 5단계: 검증 결과 리포트

```markdown
## UI 검증 결과

### 📊 요약

- 검증한 파일: 5개
- 발견된 이슈: 12개
- 자동 수정 가능: 8개
- 수동 확인 필요: 4개

### ⚠️ 발견된 이슈

#### 높음 (4)

1. `RecipeList.tsx` - views에 복잡한 로직 포함 → widgets로 이동 권장
2. `SearchHeader.tsx` - 레이어 규칙 위반 (features → widgets import)

#### 중간 (5)

3. `RecipeCard.tsx` - 임의의 색상 사용 (bg-gray-100)
4. `FilterButton.tsx` - aria-label 누락

#### 낮음 (3)

5. `RecipesPage.tsx` - text-xl 대신 text-heading-2 사용 권장

### 🔧 자동 수정 제안

다음 이슈들은 자동으로 수정할 수 있습니다:

- Typography 클래스 교체 (5개)
- Color 클래스 교체 (3개)

자동 수정을 진행할까요?
```

## 6단계: 자동 수정 실행

사용자가 승인하면:

1. Typography 클래스 교체
2. Color 클래스 교체
3. 간단한 aria-label 추가
4. Linter 실행 및 확인

## 7단계: 최적화 제안

추가 개선 사항 제안:

```markdown
### 💡 최적화 제안

1. **성능 개선**

   - RecipeCard에 React.memo 적용 → 불필요한 리렌더링 방지
   - 이미지 lazy loading 추가

2. **코드 품질**

   - SearchHeader Props 인터페이스 개선
   - Custom hooks 추출 (useRecipeFilter)

3. **접근성**

   - 키보드 네비게이션 개선
   - ARIA 속성 추가

4. **번들 크기**
   - 동적 import로 code splitting
   - 현재: 245KB → 예상: 180KB (-26%)
```

## 실행 예시

```
사용자: /validate-ui

AI: 현재 열린 UI 파일들을 검증합니다...
[검증 진행]
[결과 리포트 제시]

사용자: 자동 수정 진행

AI:
✓ RecipeCard.tsx - text-2xl → text-heading-2
✓ SearchBar.tsx - text-gray-600 → text-text-secondary
✓ FilterButton.tsx - aria-label 추가
✓ Linter 통과

12개 이슈 중 8개를 자동으로 수정했습니다.
남은 4개는 수동 확인이 필요합니다.
```

## 체크리스트

- [ ] Typography: 커스텀 클래스 사용?
- [ ] Color: 정의된 팔레트 사용?
- [ ] FSD: 올바른 레이어 배치?
- [ ] Import: 레이어 규칙 준수?
- [ ] Props: 타입 정의 완료?
- [ ] A11y: 접근성 속성 추가?
- [ ] 재사용: 공통 컴포넌트 활용?

--- End Command ---
