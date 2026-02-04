# Cursor Rules & Commands 사용 가이드

프로젝트에 설정된 Rules와 Commands의 사용법을 안내합니다.

## 📋 Rules (규칙)

Rules는 자동으로 적용되어 AI가 코딩할 때 항상 참고합니다.

### 1. FSD 아키텍처 규칙 (`fsd-architecture.mdc`)

**언제 적용되나요?**

- 항상 적용됩니다 (`alwaysApply: true`)
- 모든 대화에서 FSD 아키텍처를 준수합니다

**무엇을 하나요?**

- 컴포넌트를 올바른 레이어에 배치
- Import 규칙 준수 확인
- Views에 로직이 포함되지 않도록 방지

**예시 상황:**

```
사용자: "새 컴포넌트를 만들어줘"

AI: "어느 레이어에 만들까요?
- features: 사용자 기능 (검색, 필터 등)
- widgets: 독립적 UI 블록 (리스트, 네비게이션 등)
- views: 페이지 레벨"

→ FSD 규칙에 따라 적절한 위치를 안내
```

### 2. UI 스타일링 규칙 (`ui-styling.mdc`)

**언제 적용되나요?**

- `.tsx` 파일 작업 시 자동 적용
- UI 컴포넌트 생성/수정 시

**무엇을 하나요?**

- tailwind.config.ts의 Typography, Color 사용 강제
- lucide-react 아이콘 사용 유도
- 공통 컴포넌트 재사용 권장

**예시 상황:**

```
사용자: "제목 스타일을 크게 만들어줘"

AI: (자동으로)
<h1 className="text-heading-1">제목</h1>

→ text-3xl 대신 정의된 typography 사용
```

---

## 🛠️ Commands (명령어)

Commands는 `/command-name` 형태로 직접 호출합니다.

### 1. `/create-component` - 컴포넌트 생성

**언제 사용하나요?**

- 새로운 UI 컴포넌트를 만들 때
- FSD 구조에 맞게 자동으로 생성하고 싶을 때

**사용법:**

```
/create-component
```

**진행 과정:**

1. AI가 필요한 정보를 질문

   - 컴포넌트 이름
   - 레이어 (shared/entities/features/widgets/views)
   - 기능명 (kebab-case)
   - 타입 (ui/model/api)
   - Storybook 생성 여부

2. 자동으로 생성
   - 컴포넌트 파일
   - Props 인터페이스
   - index.ts export
   - Storybook 파일 (선택)

**예시:**

```
사용자: /create-component

AI: 컴포넌트 정보를 알려주세요
사용자:
- 이름: SortButton
- 레이어: features
- 기능명: recipe-filter
- 타입: ui
- Storybook: 아니오

AI: ✓ src/features/recipe-filter/ui/SortButton.tsx 생성
    ✓ src/features/recipe-filter/index.ts 업데이트
```

### 2. `/refactor-component` - 컴포넌트 분리

**언제 사용하나요?**

- 컴포넌트가 너무 커졌을 때 (100줄 이상)
- 여러 역할이 섞여있을 때
- FSD 레이어를 재조정하고 싶을 때

**사용법:**

```
/refactor-component @파일경로
```

**진행 과정:**

1. AI가 컴포넌트 분석
2. 분리 계획 제시
3. 사용자 승인 후 실행
4. 새 컴포넌트들 생성
5. 원본 컴포넌트 리팩토링

**예시:**

```
사용자: /refactor-component @RecipesPage.tsx

AI: 분석 결과:
- 150줄, 검색/필터/무한스크롤 로직 포함
- 분리 제안:
  1. SearchHeader → features/recipe-search
  2. RecipeList → widgets/recipe-list
  3. RecipesPage → views (조합만)

승인하시겠습니까?

사용자: 승인

AI: ✓ 컴포넌트 분리 완료
    RecipesPage: 150줄 → 20줄
```

### 3. `/validate-ui` - UI 검증

**언제 사용하나요?**

- UI 구현 완료 후 검증할 때
- 디자인 시스템 준수 확인
- FSD 아키텍처 점검

**사용법:**

```
/validate-ui
```

**진행 과정:**

1. 현재 열린 .tsx 파일들 검증
2. 이슈 리포트 생성
3. 자동 수정 제안
4. 사용자 승인 시 수정 실행

**예시:**

```
사용자: /validate-ui

AI: 검증 결과:
⚠️ 발견된 이슈: 12개
- 높음: RecipeList가 views에 있음 → widgets로 이동
- 중간: text-xl 사용 → text-heading-2로 변경
- 낮음: aria-label 누락

8개는 자동 수정 가능합니다. 진행할까요?

사용자: 진행

AI: ✓ 8개 이슈 자동 수정 완료
```

### 4. `/finish-work` - 빌드 & 커밋

**언제 사용하나요?**

- 작업 완료 후 커밋하기 전
- 빌드 검증 + 커밋을 한 번에

**사용법:**

```
/finish-work
```

**진행 과정:**

1. 빌드 실행 및 검증
2. 에러 있으면 수정 안내
3. 성공하면 커밋 메시지 생성
4. 사용자 승인 후 커밋

---

## 🎯 상황별 사용 가이드

### 상황 1: 새 기능 구현 시작

```
1. /create-component
   → 필요한 컴포넌트들 생성

2. 코딩 작업
   → Rules가 자동으로 FSD, 스타일링 가이드

3. /validate-ui
   → 디자인 시스템 준수 확인

4. /finish-work
   → 빌드 검증 후 커밋
```

### 상황 2: 기존 코드 리팩토링

```
1. /refactor-component @파일
   → 큰 컴포넌트 분리

2. /validate-ui
   → 아키텍처 재검증

3. /finish-work
   → 빌드 검증 후 커밋
```

### 상황 3: UI 구현 완료 후

```
1. /validate-ui
   → 디자인 시스템, A11y 검증

2. 이슈 수정

3. /finish-work
   → 최종 빌드 & 커밋
```

---

## 💡 팁

### Rule이 적용되지 않는다면?

Rules는 자동으로 적용되지만, 명시적으로 언급하면 더 확실합니다:

```
"FSD 아키텍처에 맞게 RecipeList를 만들어줘"
"디자인 시스템을 준수하며 버튼을 스타일링해줘"
```

### Command를 잊었다면?

```
"사용 가능한 커맨드 목록 보여줘"
```

### 빠른 워크플로우

```
/create-component → 코딩 → /validate-ui → /finish-work
```

---

## 📁 파일 구조

```
.cursor/
├── rules/
│   ├── fsd-architecture.mdc      # FSD 아키텍처 규칙
│   └── ui-styling.mdc             # UI 스타일링 규칙
├── commands/
│   ├── create-component.md        # 컴포넌트 생성
│   ├── refactor-component.md      # 컴포넌트 리팩토링
│   ├── validate-ui.md             # UI 검증
│   ├── finish-work.md             # 빌드 & 커밋
│   └── ... (기타 commands)
└── USAGE_GUIDE.md                 # 이 파일
```

---

## 🔧 커스터마이징

### 새 Rule 추가

```bash
.cursor/rules/my-rule.mdc
```

### 새 Command 추가

```bash
.cursor/commands/my-command.md
```

형식은 기존 파일들을 참고하세요!
