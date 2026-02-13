# My Recipe Archive

> **[Live Demo](https://myrea.vercel.app/)**

여러 플랫폼에 흩어진 레시피를 시도하고, 나만의 최적화된 레시피를 기록하고 관리하는 **개인 레시피 아카이브** 서비스입니다.

<!-- 📸 스크린샷: 메인 페이지(레시피 목록) 캡처 1장 — 앱의 전체적인 분위기를 보여주는 대표 이미지 -->

## 주요 기능

- **레시피 CRUD** — 재료, 조리 단계, 썸네일 이미지를 포함한 레시피 작성/수정/삭제
- **다중 카테고리 필터링** — 상황별(일상, 초스피드, 혼밥 등), 장르별(한식, 양식 등), 종류별(면요리, 국/탕 등) 필터
- **검색 & 정렬** — 키워드 검색 + 조리 시간 범위 필터 + 최신순/인기순 정렬
- **즐겨찾기** — 레시피 즐겨찾기 등록/해제 (Optimistic Update)
- **조리 기록** — 조회수 카운트 (하루 1회 제한)
- **카카오 소셜 로그인** — Supabase OAuth를 통한 간편 인증
- **PWA** — 모바일에서 네이티브 앱처럼 설치 및 사용 가능

<!-- 📸 스크린샷 (선택): 주요 기능 2~3장을 가로 나열
     예시: 레시피 상세 | 레시피 작성 폼 | 필터 Bottom Sheet
     GitHub README에서는 아래처럼 나열하면 좋습니다:
     | ![상세](screenshots/detail.png) | ![작성](screenshots/create.png) | ![필터](screenshots/filter.png) |
     |:---:|:---:|:---:|
-->

## 기술 스택

| 영역      | 기술                                                   |
| --------- | ------------------------------------------------------ |
| Framework | Next.js 15 (App Router)                                |
| Language  | TypeScript                                             |
| Styling   | Tailwind CSS + Radix UI + CVA                          |
| State     | React Query (서버) · nuqs (URL) · Zustand (클라이언트) |
| Form      | React Hook Form + Zod                                  |
| Backend   | Supabase (DB · Auth · Storage)                         |
| PWA       | Serwist                                                |
| Testing   | Vitest · Storybook · MSW                               |
| AI        | Claude Code (개발 파트너)                              |

## 아키텍처

### Feature-Sliced Design (FSD)

기존 실무에서 사용하던 목적 중심 디렉토리 구조(`components/`, `hooks/` 등)가 프로젝트 확장 시 경계가 모호해지는 문제를 경험하고, **도메인 중심의 계층형 구조**인 FSD를 도입했습니다.

```
src/
├── shared/       # 공통 UI, 유틸리티, API 클라이언트
├── entities/     # 비즈니스 엔티티 (recipe, user, category, favorite, cooking-log)
├── features/     # 사용자 기능 (recipe-search, recipe-create)
├── widgets/      # 복합 UI 블록 (recipe-list, bottom-navigation, recipe-section)
├── views/        # 페이지 컴포지션 (8개 뷰)
└── app/          # Next.js App Router (라우팅, API Routes)
```

**Import 규칙**: 상위 레이어 → 하위 레이어만 허용, 동일 레이어 간 교차 참조 금지

### 데이터 페칭 아키텍처

읽기와 쓰기를 명확히 분리하고, SSR과 CSR을 일관된 패턴으로 연결합니다.

```
[SSR] page.tsx → server.ts(직접 DB 조회) → prefetch + HydrationBoundary
                                                ↓
[CSR] hooks.ts → client.ts(Route API 호출) → useSuspenseQuery / useQuery
                                                ↓
[Mutation] hooks.ts → actions.ts(Server Actions) → revalidatePath
```

각 엔티티는 동일한 API 파일 구조(`server.ts` · `client.ts` · `actions.ts` · `hooks.ts` · `keys.ts`)를 유지하여 일관성을 확보합니다.

### 에러 핸들링

에러 유형별로 UI 패턴을 분리하여, 사용자 흐름을 최대한 유지하는 방향으로 설계했습니다.

| 에러 유형                   | 처리 방식                                  |
| --------------------------- | ------------------------------------------ |
| 쿼리 에러 (메인 콘텐츠)     | Skeleton + ErrorBoundary → 재시도 바텀시트 |
| 뮤테이션 에러 (재시도 가능) | ErrorBottomSheet (흐름 유지)               |
| 뮤테이션 에러 (권한/404)    | Toast 자동 dismiss                         |
| 비치명적 에러               | 무시 (meta.suppressErrorToast)             |

`MutationCache` 글로벌 핸들러가 mutation 에러를 일괄 처리하고, 개별 mutation은 `meta` 옵션으로 동작을 분기합니다.

## 기술적 의사결정

### Seamless한 필터 전환 UX

검색 필터나 정렬 변경 시 화면이 깜빡이는 현상을 방지하기 위해 `useDeferredValue`로 이전 데이터를 유지하면서 새 데이터를 백그라운드에서 로딩합니다. 전환 중에는 `opacity` 처리로 시각적 피드백을 제공합니다.

<!-- 📸 스크린샷 (선택): 필터 전환 시 이전 데이터가 유지되는 모습 (Before/After 또는 GIF) -->

### 폼 유효성 검증

`react-hook-form` + `Zod` 조합으로 다단계 폼 검증을 구현했습니다. 재료/조리 단계의 동적 필드 배열(`useFieldArray`), 크로스 필드 검증, 클라이언트 이미지 압축 후 Supabase Storage 업로드를 포함합니다.

### URL 기반 상태 관리

검색어, 필터, 정렬 등 공유 가능한 상태는 `nuqs`를 통해 URL에 반영합니다. 같은 검색 결과를 URL 공유만으로 재현할 수 있고, 브라우저 뒤로 가기로 이전 필터 상태를 복원할 수 있습니다.

### AI 기반 개발 워크플로우

Claude Code를 개발 파트너로 적극 활용하여, FSD 아키텍처 규칙 · 코드 스타일 컨벤션 · 데이터 페칭 패턴 등을 `.claude/rules/`에 문서화하고 일관된 코드 품질을 유지했습니다.

## 테스트 전략

| 계층        | 도구                     | 대상                                                    |
| ----------- | ------------------------ | ------------------------------------------------------- |
| Unit / Hook | Vitest + Testing Library | 유틸 함수, Zod 스키마, React Query 훅 (7개 테스트 파일) |
| Component   | Storybook + MSW          | UI 인터랙션, 상태별 렌더링 (37개 스토리)                |

Storybook에서 MSW로 API를 모킹하여 Default / Loading / Error / Empty 상태를 시각적으로 검증합니다.

<!-- 📸 스크린샷 (선택): Storybook 화면 1장 — 다양한 상태(성공/에러/로딩)가 나열된 모습 -->
