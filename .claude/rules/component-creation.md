---
description: 컴포넌트 생성 원칙
globs: '**/shared/ui/**/*.tsx,**/entities/**/ui/**/*.tsx,**/features/**/ui/**/*.tsx,**/widgets/**/ui/**/*.tsx'
---

# 컴포넌트 생성 원칙

## 기존 컴포넌트 우선 확인

새 컴포넌트 작성 전 `shared/ui/`에 재사용 가능한 컴포넌트가 있는지 먼저 확인

## shared/ui 컴포넌트

- shadcn/ui 기반으로 생성
- 프로젝트 디자인 시스템 적용 필수

### 디자인 시스템 변환

```typescript
// Typography
text-sm → text-body-2
text-base → text-body-1
font-semibold text-lg → text-heading-3

// Colors
bg-primary → bg-primary-base
text-primary-foreground → text-white
bg-secondary → bg-secondary-base
```

## 레이어별 컴포넌트 위치

| 레이어 | 위치 | 특징 |
|--------|------|------|
| shared | `shared/ui/` | 범용 UI, 디자인 시스템 |
| entities | `entities/[name]/ui/` | 비즈니스 엔티티 표현 |
| features | `features/[name]/ui/` | 사용자 기능 |
| widgets | `widgets/[name]/ui/` | 복합 UI 블록 |
| views | `views/[name]/ui/` | 페이지 조합 |

## 필수 파일

- `[ComponentName].tsx` - 컴포넌트
- `[ComponentName].stories.tsx` - 스토리
- `index.ts` - export
