---
description: Story generation — Use when auto-generating Storybook stories (.stories.tsx) for a component
---

# Story Generation

Auto-generate Storybook stories for a component.

## Usage

```
/story [component path or name]
```

Examples:
```
/story RecipeCard
/story src/shared/ui/button.tsx
```

## Workflow

### Step 1: Analyze Component

Read and analyze the target component file:
- Component name
- Props interface
- Variants (variant, size, colorScheme, etc.)
- Event handlers (onClick, onChange, etc.)
- FSD layer location

### Step 2: Determine Component Type

| Type | Layer | Story Characteristics |
|------|--------|------------|
| UI Primitive | shared/ui | argTypes control setup |
| Entity | entities/*/ui | Mock data required |
| Feature | features/*/ui | fn() action handlers |
| Widget | widgets/*/ui | Loading/Error/Empty required |
| View | views/*/ui | Fullscreen layout, Loading/Error/Empty required |

### Step 3: Identify React Query Dependencies

Search for React Query hooks used in the component and **child components**:

1. **Check hook types** — story setup differs per hook:

| Hook | Cache Setup | Suspense | Notes |
|----|----------|----------|------|
| `useSuspenseQuery` | `setQueryData` required | Required | Suspends without cache |
| `useSuspenseInfiniteQuery` | `setQueryData` (pages structure) required | Required | `{ pages, pageParams }` |
| `useQuery` | `setQueryData` recommended | Not needed | Check enabled conditions |
| `useMutation` | - | - | Consider adding MutationError story |

2. **Query key → mock data mapping** — identify keys functions and corresponding mock data

3. **Check mock data availability:**
   - `entities/{entity}/model/mock.ts` exists → import and use
   - **If mock.ts doesn't exist, create it:**
     - Check types from `entities/{entity}/model/types.ts`
     - Write mock data matching types
     - `mock` prefix naming (`mockProfile`, `mockRecipes`, etc.)
     - Constants in `SCREAMING_SNAKE_CASE` (`MOCK_COOK_COUNT`)
     - Korean data matching app tone, minimal required fields only
   - After creation, review adding endpoint handlers to `src/shared/mocks/handlers.ts`

4. **Check `nuqs` (useQueryState) usage** — wrap with `NuqsTestingAdapter` if used

Skip this step and proceed to Step 4 if no React Query hooks are used.

### Step 4: Generate Story File

Create `[ComponentName].stories.tsx`:

1. Write meta in CSF 3.0 format
2. Set title matching FSD layer
3. Set simple props as argTypes controls

#### Components Without React Query

4. Add stories matching component type (Default, edge cases, etc.)

#### Components With React Query (Widget/View)

4. Check or create Skeleton/fallback component inside story
5. Write QueryClient factory functions:
   - `createSuccessQueryClient()` — `staleTime: Infinity` + set mock data
   - `createErrorQueryClient()` — `retry: false` only
6. Story writing order:

| Story | Data Strategy | Decorator |
|--------|-----------|-----------|
| Default | `setQueryData` | `QueryClientProvider` + `Suspense` |
| Empty | `setQueryData` (empty array/null) | Same as Default |
| Loading | MSW `delay('infinite')` | `QueryClientProvider` (no Suspense) |
| Error | MSW `HttpResponse 500` | `QueryClientProvider` (no Suspense) |
| MutationError | `setQueryData` + render `ErrorBottomSheet` directly | Default + ErrorBottomSheet |

7. Write MSW handlers (`import { http, delay, HttpResponse } from 'msw'`):
   - Loading: `http.get('/api/*', async () => { await delay('infinite') })`
   - Error: `http.get('/api/*', () => HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 }))`
   - No MSW setup needed for Default (global handlers provide success response)

8. `profileKeys.current()` — always set profile cache even in Loading/Error
9. Wrap all decorators with `NuqsTestingAdapter` when using `nuqs`

### Step 5: Verify

```bash
pnpm storybook
```

Verify rendering in Storybook
