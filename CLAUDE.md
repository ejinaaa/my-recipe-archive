# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 실행
pnpm storybook    # Storybook 실행 (포트 6006)
```

## 아키텍처 (FSD - Feature-Sliced Design)

레이어 계층 (하위 → 상위): `shared → entities → features → widgets → views`

**Import 규칙:**
- 상위 레이어는 하위 레이어를 import 가능
- 하위 레이어는 상위 레이어를 import 불가
- 같은 레이어 간 cross-import 금지

```
src/
├── shared/      # 재사용 가능한 UI, 유틸리티, API 클라이언트
├── entities/    # 비즈니스 엔티티 (recipe, user, category)
├── features/    # 사용자 기능 (recipe-search)
├── widgets/     # 복잡한 UI 블록 (recipe-list, bottom-navigation)
├── views/       # 페이지 조합 (비즈니스 로직 금지)
└── app/         # Next.js App Router 페이지
```

## 데이터 페칭 패턴

| 패턴 | 파일 위치 | 용도 |
|------|----------|------|
| Server API | `entities/{entity}/api/server.ts` | SSR, 초기 페이지 로드 |
| Server Actions | `entities/{entity}/api/actions.ts` | mutation + 자동 revalidation |
| React Query Hooks | `entities/{entity}/api/hooks.ts` | 클라이언트 필터링, 무한 스크롤 |

## 디자인 시스템

**Typography** (tailwind.config.ts 정의):
- `text-heading-1` (24px Bold), `text-heading-2` (20px Bold), `text-heading-3` (18px SemiBold)
- `text-body-1` (16px), `text-body-2` (14px), `text-caption` (12px)

**Colors:**
- Primary: `primary-base` (#FF8762), Secondary: `secondary-base` (#B9DA99)
- Text: `text-primary` (#33312F), `text-secondary` (#666666)

**Icons:** lucide-react만 사용

## 공통 컴포넌트 생성

`shared/ui/*`에 필요한 컴포넌트가 없는 경우:

1. shadcn/ui로 기본 컴포넌트 생성:
   ```bash
   pnpm dlx shadcn@latest add [component-name]
   ```
2. 프로젝트 디자인 시스템 적용:
   - Typography → 커스텀 클래스 사용 (`text-heading-1`, `text-body-1` 등)
   - Colors → 프로젝트 색상 팔레트 사용 (`primary-base`, `text-primary` 등)

## 주요 컨벤션

- Path alias: `@/*` → `./src/*`
- Views 레이어: 조합만, 비즈니스 로직 금지
- Entity 구조: `api/` (server.ts, actions.ts, hooks.ts), `model/` (types.ts), `ui/`
- 새로운 컴포넌트/로직 작성 시, 프로젝트에 이미 정의된 코드가 있다면 우선적으로 재사용
- 새로운 화면/UI 개발 시 프로젝트의 톤앤매너와 기존 스타일 패턴 유지

## 커뮤니케이션

- 답변과 질문은 한국어로 진행
