# 코드 스타일 정리

> 컨벤션은 `rules/code-style.md` 참고

## 사용법

```
/style                     # 최근 변경 파일 대상
/style src/features/search  # 특정 폴더 대상
/style --all                # 프로젝트 전체 (src/)
```

## 워크플로우

### 1단계: 대상 파일 수집

| 인자 | 대상 |
|------|------|
| (없음) | `git diff --name-only HEAD` 최근 변경 `.ts`, `.tsx` |
| 경로 | 해당 경로의 `.ts`, `.tsx` |
| `--all` | `src/` 전체 `.ts`, `.tsx` |

### 2단계: 검증 항목

| 항목 | 검증 내용 |
|------|----------|
| Type Import | `import type` 또는 `{ type ... }` 사용 여부 |
| 네이밍 | 컴포넌트(PascalCase), 훅(use~Query/Mutation), API(~Api/fetch~/~Action) |
| 함수 선언 | 훅/컴포넌트 → `function`, 유틸 → `const` 화살표 |
| TypeScript | Props → `interface`, 유니온/유틸리티 → `type` |
| 파일 구조 | import 순서, 타입/상수/함수 배치 |
| 주석 | 한글 작성 여부 |

### 3단계: 자동 수정

위반 사항을 자동으로 수정하고, 수정이 어려운 경우 사용자에게 확인

### 4단계: ESLint 실행

```bash
pnpm lint
```

lint 에러 발생 시 수정 후 재실행

### 5단계: 결과 보고

```
## 스타일 정리 결과

### 수정 사항
1. [파일:라인] - [위반] → [수정 내용]

### 요약
- 검사 파일: N개
- 수정: N건
- lint: ✅ 통과 / ❌ 실패
```
