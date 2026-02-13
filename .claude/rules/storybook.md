---
description: Storybook story writing principles (CSF 3.0)
globs: '**/*.stories.tsx'
---

# Storybook Story Writing Principles (CSF 3.0)

## Basic Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ComponentName } from './ComponentName';

const meta = {
  title: '[layer]/[segment]/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  args: { /* default args */ },
  argTypes: { /* control settings */ },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

## Story Separation Principles

### Handle via Controls (no separate story)

Simple props like `variant`, `size`, `disabled` → set as `argTypes` controls

### Separate into Individual Stories

- Complex children compositions
- Data edge cases (long text, missing image, etc.)
- Loading / Error / Empty states (Widget/View)

## Required Stories by Component Type

| Type | Default | Additional Stories |
|------|---------|------------|
| UI Primitive | argTypes control setup | Complex children |
| Entity | Use mock data | Edge cases |
| Feature | fn() action handlers | Special states |
| Widget | Default data | Loading, Error, Empty |
| View | Default data | Loading, Error, Empty, MutationError |

## Title Naming

`[layer]/[segment]/ComponentName` — e.g., `shared/Button`, `entities/recipe/RecipeCard`, `views/recipe-detail/RecipeDetailPage`

## Mock Data Rules

- Import from `entities/{entity}/model/mock.ts` (**no inline mocks**)
- If mock.ts doesn't exist, create it: `mock` prefix, `SCREAMING_SNAKE_CASE` constants, Korean data
- After creation, review adding endpoint handlers to `src/shared/mocks/handlers.ts`

## MSW + React Query Data Strategy

| Story | QueryClient | Suspense | MSW parameters | Additional |
|--------|-----------|----------|----------------|----------|
| Default | Success | Yes | — | — |
| Empty | Success (empty data) | Yes | — | — |
| Loading | Error + profile cache | No | `delay('infinite')` | — |
| Error | Error | No | `HttpResponse 500` | — |
| MutationError | Success | Yes | — | Render `ErrorBottomSheet` directly |

### QueryClient Factory Pattern

```typescript
// Success: staleTime: Infinity + set mock data
function createSuccessQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(recipeKeys.detail(id), mockRecipes[0]);
  queryClient.setQueryData(profileKeys.current(), mockProfile);
  return queryClient;
}

// Error: retry: false only (no staleTime → immediate fetch → MSW error response)
function createErrorQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}
```

### Key Rules

- **profileKeys.current()**: Always set profile cache even in Loading/Error (useQuery enabled is conditional, missing cache triggers unintended fetch)
- **Infinite Query**: Set with `{ pages: [...], pageParams: [0] }` structure
- **When using nuqs**: Wrap all decorators with `NuqsTestingAdapter`

## Decorator Pattern

Basic structure (Default/Empty):

```typescript
decorators: [
  Story => {
    const queryClient = createSuccessQueryClient();
    return (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Skeleton />}>
          <Story />
        </Suspense>
      </QueryClientProvider>
    );
  },
],
```

**Variations:**

| Story | Decorator Differences |
|--------|----------------|
| Loading | `createErrorQueryClient()` + profile cache only, no Suspense, MSW `delay('infinite')` |
| Error | `createErrorQueryClient()`, no Suspense, MSW `HttpResponse.json({...}, { status: 500 })` |
| MutationError | `createSuccessQueryClient()`, add `<ErrorBottomSheet open ... />` below `<Story />` |
| URL state | Wrap entire decorator with `<NuqsTestingAdapter>` |
