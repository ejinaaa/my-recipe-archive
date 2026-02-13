---
description: Code style and convention rules
alwaysApply: true
---

# Code Style Rules

## Type Import

```typescript
// ✅ type-only import 사용
import type { Recipe, RecipeInsert } from '../model/types';
import { type UseQueryResult } from '@tanstack/react-query';
```

## Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Component | PascalCase | `RecipeCard`, `SearchBar` |
| Hook | use + PascalCase + suffix | See hook/function naming below |
| Utility function | camelCase | `formatDate`, `cn` |
| Constant | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `MAX_ITEMS` |
| Type/Interface | PascalCase | `Recipe`, `ButtonProps` |
| Filename (component) | PascalCase | `RecipeCard.tsx` |
| Filename (util/hook) | camelCase | `hooks.ts`, `utils.ts` |

## Hook/Function Naming Conventions

| Category | Pattern | Example |
|----------|---------|---------|
| Query hook | `use` + noun + `Query` | `useCurrentProfileQuery` |
| Suspense Query hook | `useSuspense` + noun + `Query` | `useSuspenseRecipeQuery` |
| Mutation hook | `use` + verb + noun + `Mutation` | `useCreateRecipeMutation` |
| Server API function | verb + noun + `Api` | `getRecipeApi`, `createRecipeApi` |
| Client fetch function | `fetch` + noun | `fetchRecipe`, `fetchRecipesPaginated` |
| Server Action | verb + noun + `Action` | `createRecipeAction` |

## Function Declarations

- **Hooks**: `function` declaration — `export function useRecipesQuery() { ... }`
- **Utilities**: `const` arrow function — `export const formatDate = () => { ... }`
- **Components**: `function` declaration — `export function RecipeCard() { ... }`
- **React 19 ref**: Declare `ref?: React.Ref<T>` directly in props instead of `forwardRef`

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

## Comments

- Write in **Korean**
- JSDoc: Purpose and notable behavior of hooks/functions (1-2 lines)
- Inline: Explain intent only for complex logic

## TypeScript

- `interface`: Object types, extensible (Props, etc.)
- `type`: Unions, intersections, utility types

## TDD

Use TDD when creating or modifying high-ROI functions/hooks (complex branching, data transformation, many edge cases).
When modifying functions/hooks that have existing tests (`*.test.ts`), run those tests after changes to confirm they pass.

> See `testing.md` for test patterns and TDD cycle

## File Structure

```typescript
// 1. 'use client' or 'use server' (if needed)
// 2. Imports
// 3. Types/Interfaces
// 4. Constants
// 5. Helper functions
// 6. Main export (component/hook/function)
// 7. Named exports
```
