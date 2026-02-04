--- Cursor Command: refactor-component ---

# 컴포넌트 분리 및 리팩토링

큰 컴포넌트를 작은 단위로 분리하고 FSD 아키텍처에 맞게 재배치합니다.

## 1단계: 현재 컴포넌트 분석

대상 컴포넌트 파일을 읽고 다음을 확인:

1. **파일 크기**: 100줄 이상이면 분리 검토
2. **로직 복잡도**:
   - 여러 useState, useEffect 사용
   - 복잡한 비즈니스 로직
   - 데이터 fetching, 무한 스크롤 등
3. **UI 블록**:
   - 주석으로 구분된 섹션
   - 재사용 가능한 UI 요소
4. **현재 위치**: 어느 레이어에 있는가?

## 2단계: 분리 계획 수립

사용자에게 분리 계획을 제시하고 승인받기:

```markdown
## 분리 계획

### 현재 상태

- 파일: src/views/recipes/ui/RecipesPage.tsx
- 줄 수: 150줄
- 문제: 검색, 필터링, 무한스크롤 로직이 모두 포함됨

### 제안 분리안

1. **SearchHeader** → features/recipe-search
   - 검색 바, 필터, 정렬 버튼
   - 검색 상태 관리
2. **RecipeList** → widgets/recipe-list

   - 레시피 그리드
   - 무한 스크롤 로직
   - 로딩/에러 UI

3. **RecipesPage** → views/recipes (리팩토링)
   - 위 컴포넌트들을 조합만
   - 페이지 레벨 레이아웃

승인하시면 분리를 진행합니다.
```

## 3단계: 컴포넌트 분리 실행

### A. 새 컴포넌트 생성

각 분리된 부분을 적절한 레이어에 생성:

```typescript
// features/recipe-search/ui/SearchHeader.tsx
'use client';

import { useState } from 'react';

interface SearchHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
}: SearchHeaderProps) {
  // 검색 관련 로직만
}
```

### B. Props 인터페이스 정의

부모와 자식 간 데이터 흐름 설계:

```typescript
// 제어 컴포넌트 패턴
interface ControlledProps {
  value: string;
  onChange: (value: string) => void;
}

// 비제어 컴포넌트 패턴
interface UncontrolledProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
```

### C. 로직 이동

상태와 로직을 적절한 컴포넌트로 이동:

```typescript
// ❌ BEFORE - Views에 로직 포함
export function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  // ... 100줄의 로직
}

// ✅ AFTER - Views는 조합만
export function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <SearchHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <RecipeList searchQuery={searchQuery} />
    </div>
  );
}
```

## 4단계: Import 경로 업데이트

```typescript
// ✅ GOOD - 새 경로로 업데이트
import { SearchHeader } from '@/features/recipe-search';
import { RecipeList } from '@/widgets/recipe-list';

// ❌ BAD - 상대 경로 사용 금지
import { SearchHeader } from './SearchHeader';
```

## 5단계: 기존 파일 정리

- 분리된 부분 제거
- 불필요한 import 제거
- 사용하지 않는 상태 제거

## 6단계: 검증

- [ ] 모든 기능이 동일하게 작동하는가?
- [ ] FSD 레이어 규칙을 지켰는가?
- [ ] Import 순환 참조가 없는가?
- [ ] Linter 에러가 없는가?
- [ ] 빌드가 성공하는가?

## 7단계: 최적화 제안

추가 개선 사항 제안:

1. **Memoization**: 불필요한 리렌더링 방지
2. **Code Splitting**: 동적 import로 번들 크기 최적화
3. **Custom Hooks**: 반복되는 로직 추출
4. **Error Boundaries**: 에러 처리 개선

## 실행 예시

```
사용자: /refactor-component @RecipesPage.tsx

AI: RecipesPage를 분석했습니다.
[분리 계획 제시]

사용자: 승인

AI:
✓ features/recipe-search/ui/SearchHeader.tsx 생성
✓ widgets/recipe-list/ui/RecipeList.tsx 생성
✓ views/recipes/ui/RecipesPage.tsx 리팩토링
✓ import 경로 업데이트
✓ 빌드 테스트 통과

RecipesPage가 150줄 → 20줄로 간소화되었습니다!
```

## 리팩토링 패턴

### 조건부 렌더링 분리

```typescript
// ❌ BEFORE
{
  loading && <Spinner />;
}
{
  error && <ErrorMessage />;
}
{
  data && <DataList />;
}

// ✅ AFTER
<DataView loading={loading} error={error} data={data} />;
```

### 반복되는 UI 추출

```typescript
// ❌ BEFORE
<button onClick={handleSort}>정렬</button>
<button onClick={handleFilter}>필터</button>
<button onClick={handleExport}>내보내기</button>

// ✅ AFTER
const actions = [
  { label: '정렬', onClick: handleSort },
  { label: '필터', onClick: handleFilter },
  { label: '내보내기', onClick: handleExport },
];

<ActionBar actions={actions} />
```

--- End Command ---
