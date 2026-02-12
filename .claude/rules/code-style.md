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

// ❌ 일반 import와 혼용 금지
import { Recipe, RecipeInsert } from '../model/types';
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

```typescript
// ✅ 훅 이름으로 역할 구분 가능
const { data: profile } = useCurrentProfileQuery();           // Query
const { data: recipe } = useSuspenseRecipeQuery(id);          // Suspense Query
const createRecipe = useCreateRecipeMutation();                // Mutation

// ✅ 함수 이름으로 호출 대상 구분 가능
const recipe = await getRecipeApi(id);                         // Supabase 직접 접근
const recipe = await fetchRecipe(id);                          // Route API 호출
const recipe = await createRecipeAction(data);                 // Server Action
```

## React 컴포넌트

### ref 전달 패턴 (React 19)

```typescript
// ✅ React 19 - ref를 직접 prop으로 받기
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  ref?: React.Ref<HTMLButtonElement>;
}

function Button({ className, variant, ref, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
}

export { Button };
```

### 일반 컴포넌트

```typescript
interface RecipeCardProps {
  recipe: Recipe;
  onFavorite?: (id: string) => void;
}

export function RecipeCard({ recipe, onFavorite }: RecipeCardProps) {
  return (
    // ...
  );
}
```

## 함수 선언

### Hooks - function 선언문

```typescript
// ✅ 훅은 function 선언문 사용
export function useRecipesQuery(userId?: string): UseQueryResult<Recipe[], Error> {
  return useQuery({
    queryKey: recipeKeys.list(userId),
    queryFn: () => fetchRecipes(userId),
  });
}
```

### 유틸리티 - const 화살표 함수

```typescript
// ✅ 유틸리티는 const + 화살표 함수
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};
```

### Query Keys Factory

```typescript
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (userId?: string) => [...recipeKeys.lists(), { userId }] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};
```

## 주석 (한글 작성)

```typescript
/**
 * 모든 레시피를 조회하는 훅
 * 선택적으로 유저 ID로 필터링 가능
 */
export function useRecipesQuery(userId?: string): UseQueryResult<Recipe[], Error> {
  // ...
}

/**
 * 새 레시피를 생성하는 훅
 * 즉각적인 UI 피드백을 위한 Optimistic Update 포함
 */
export function useCreateRecipeMutation(): UseMutationResult<Recipe, Error, RecipeInsert> {
  // ...
}

// 이전 쿼리 취소
await queryClient.cancelQueries({ queryKey: recipeKeys.lists() });

// 이전 값 스냅샷
const previousRecipes = queryClient.getQueryData(recipeKeys.lists());

// 에러 시 롤백
if (context?.previousRecipes) {
  queryClient.setQueryData(recipeKeys.lists(), context.previousRecipes);
}
```

## CVA (Class Variance Authority) 패턴

```typescript
const buttonVariants = cva(
  // 기본 클래스
  'inline-flex items-center justify-center gap-2 rounded-full transition-all',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border bg-transparent',
        ghost: 'bg-transparent',
      },
      size: {
        sm: 'h-10 px-3 text-body-2',
        md: 'h-12 px-4 text-body-1',
        lg: 'h-14 px-[18px] text-body-1',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  }
);
```

## TypeScript

### 타입 정의

```typescript
// Interface - 객체 타입, 확장 가능
interface RecipeCardProps {
  recipe: Recipe;
  onFavorite?: (id: string) => void;
}

// Type - 유니온, 인터섹션, 유틸리티 타입
type RecipeStatus = 'draft' | 'published' | 'archived';
type RecipeWithAuthor = Recipe & { author: User };
```

### Optional vs Required

```typescript
interface Props {
  required: string;      // 필수
  optional?: string;     // 선택
  withDefault?: string;  // 선택 + 기본값 (컴포넌트에서 처리)
}
```

## TDD

ROI가 높은 함수/훅(복잡한 분기, 데이터 변환, edge case 다수)을 새로 작성하거나 수정할 때는 TDD로 진행한다.

> 테스트 패턴 및 TDD 사이클은 `testing.md` 참고

## 파일 구조

```typescript
// 1. 'use client' 또는 'use server' (필요시)
'use client';

// 2. Imports

// 3. Types/Interfaces

// 4. Constants

// 5. Helper functions

// 6. Main export (컴포넌트/훅/함수)

// 7. Named exports
```
