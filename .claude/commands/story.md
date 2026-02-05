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
| View | views/*/ui | fullscreen layout |

### 3단계: 스토리 파일 생성

`[ComponentName].stories.tsx` 생성:

1. CSF 3.0 형식으로 meta 작성
2. title을 FSD 레이어에 맞게 설정
3. 간단한 props는 argTypes로 control 설정
4. 컴포넌트 유형에 맞는 스토리 추가

### 4단계: 검증

```bash
pnpm storybook
```

스토리북에서 렌더링 확인
