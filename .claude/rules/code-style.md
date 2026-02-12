---
description: 코드 스타일 및 컨벤션 규칙
alwaysApply: true
---

# 코드 스타일 규칙

## Type Import

```typescript
// ✅ type-only import 사용
import type { Recipe, RecipeInsert } from '../model/types';
import { type UseQueryResult } from '@tanstack/react-query';
```

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `RecipeCard`, `SearchBar` |
| 훅 | use + PascalCase + 접미사 | 아래 훅/함수 네이밍 참고 |
| 유틸 함수 | camelCase | `formatDate`, `cn` |
| 상수 | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `MAX_ITEMS` |
| 타입/인터페이스 | PascalCase | `Recipe`, `ButtonProps` |
| 파일명 (컴포넌트) | PascalCase | `RecipeCard.tsx` |
| 파일명 (유틸/훅) | camelCase | `hooks.ts`, `utils.ts` |

## 훅/함수 네이밍 컨벤션

| 분류 | 패턴 | 예시 |
|------|------|------|
| Query 훅 | `use` + 명사 + `Query` | `useCurrentProfileQuery` |
| Suspense Query 훅 | `useSuspense` + 명사 + `Query` | `useSuspenseRecipeQuery` |
| Mutation 훅 | `use` + 동사 + 명사 + `Mutation` | `useCreateRecipeMutation` |
| Server API 함수 | 동사 + 명사 + `Api` | `getRecipeApi`, `createRecipeApi` |
| Client fetch 함수 | `fetch` + 명사 | `fetchRecipe`, `fetchRecipesPaginated` |
| Server Action | 동사 + 명사 + `Action` | `createRecipeAction` |

## 함수 선언

- **훅**: `function` 선언문 — `export function useRecipesQuery() { ... }`
- **유틸리티**: `const` 화살표 함수 — `export const formatDate = () => { ... }`
- **컴포넌트**: `function` 선언문 — `export function RecipeCard() { ... }`
- **React 19 ref**: `forwardRef` 대신 props에 `ref?: React.Ref<T>` 직접 선언

## Query Keys Factory

```typescript
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (userId?: string) => [...recipeKeys.lists(), { userId }] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};
```

## 주석

- **한글** 작성
- JSDoc: 훅/함수의 목적과 특이사항 (1~2줄)
- 인라인: 복잡한 로직에만 의도 설명

## TypeScript

- `interface`: 객체 타입, 확장 가능 (Props 등)
- `type`: 유니온, 인터섹션, 유틸리티 타입

## TDD

ROI가 높은 함수/훅(복잡한 분기, 데이터 변환, edge case 다수)을 새로 작성하거나 수정할 때는 TDD로 진행한다.
기존 테스트(`*.test.ts`)가 있는 함수/훅을 수정한 경우, 수정 완료 후 해당 테스트를 실행하여 통과를 확인한다.

> 테스트 패턴 및 TDD 사이클은 `testing.md` 참고

## 파일 구조

```typescript
// 1. 'use client' 또는 'use server' (필요시)
// 2. Imports
// 3. Types/Interfaces
// 4. Constants
// 5. Helper functions
// 6. Main export (컴포넌트/훅/함수)
// 7. Named exports
```
