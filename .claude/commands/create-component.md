# 컴포넌트 생성

새 컴포넌트를 scaffolding 합니다.

## 사용법

```
/create-component [컴포넌트명] [레이어] [세그먼트?]
```

예시:
```
/create-component Button shared
/create-component RecipeCard entities recipe
/create-component SearchBar features recipe-search
```

## 워크플로우

### 1단계: 정보 확인

입력이 부족하면 사용자에게 질문:
- 컴포넌트 이름 (PascalCase)
- 레이어 (shared/entities/features/widgets/views)
- 세그먼트 (shared 외 레이어의 경우)

### 2단계: 기존 컴포넌트 확인

`shared/ui/`에 유사한 컴포넌트가 있는지 확인하고 있으면 알림

### 3단계: 파일 생성

**shared/ui의 경우:**
```bash
pnpm dlx shadcn@latest add [component-name]
```
→ 생성된 파일에 디자인 시스템 적용

**다른 레이어의 경우:**
```
src/[layer]/[segment]/ui/
├── [ComponentName].tsx
├── [ComponentName].stories.tsx
└── index.ts (export 추가)
```

### 4단계: 스토리 생성

`/story` 워크플로우 실행하여 스토리 파일 생성

### 5단계: Export 설정

`index.ts`에 export 추가

### 6단계: 검증

```bash
pnpm build
```

빌드 에러 시 수정
