---
description: URL state migration — Use when migrating global state (Zustand, etc.) to URL query parameters (nuqs)
---

# URL State Migration

Migrate global state to URL query parameters.

## Usage

```
/url-state [feature-name]
```

## Why URL State?

### URL Advantages

| Perspective | Benefit |
|------|------|
| **User Experience** | Link sharing, bookmarks, back navigation |
| **Debugging** | State explicitly exposed in URL |
| **SEO** | Search engines can index state-specific pages |
| **Testing** | Reproduce specific state with URL alone |

### State That Should Move to URL

- Search query, filters, sort, pagination
- Tab/view selection state
- Modal/drawer open state (when deep-linking needed)

### State That Should NOT Move to URL

- Sensitive info like auth tokens
- Temporary form values during input
- UI animation state

## Design Principles

### 1. Clean URL

Omit defaults from URL.

```typescript
// ?sort=latest (default) → omit from URL
// ?sort=popular → show in URL

setParams({ sort: value === 'latest' ? null : value });
```

### 2. Single Source of Truth

Same data must not be duplicated in URL and global state.

```typescript
// BAD: Needs sync, causes bugs
const [urlQuery] = useQueryState('q');
const { query } = useStore();  // Which is the truth?

// GOOD: URL is the only source
const { query } = useUrlQueryParams();
```

### 3. Separate Component from State Source

Components should not directly know about URL.

```typescript
// BAD: Component directly depends on URL
function Filter() {
  const [params] = useQueryStates({ ... });
}

// GOOD: Abstract via props
function Filter({ initialValue, onApply }) {
  // Doesn't know URL structure
}

// Connect in page
function Page() {
  const { filters, setFilters } = useUrlQueryParams();
  return <Filter initialValue={filters} onApply={setFilters} />;
}
```

## Workflow

### Step 1: Analysis

Determine if the target state is suitable for URL:

- Sharing/bookmark needs
- History restoration needs
- Security sensitivity

### Step 2: Design URL Hook

Define parameter names, types, and defaults:

```typescript
export function useUrlQueryParams() {
  const [params, setParams] = useQueryStates({
    q: parseAsString.withDefault(''),
    sort: parseAsStringEnum([...]).withDefault('latest'),
    page: parseAsInteger.withDefault(1),
  }, { shallow: true });

  // Provide read/write interface
  return { ... };
}
```

### Step 3: Refactor Components

Replace URL dependencies with props:

- Add `initialValue` props
- Add `onApply` callback
- Change internal state to local draft state

### Step 4: Connect in Page

Connect URL hook and components in Views layer.

### Step 5: Clean Up

- Remove migrated state from existing store
- Delete unused hooks/actions

## Verification Checklist

- [ ] State reflected when entering URL directly
- [ ] Back/forward navigation works
- [ ] State persists on refresh
- [ ] Same screen shown when sharing link
- [ ] URL is clean when at default values

## Technical Requirements

- `nuqs` library required (`pnpm add nuqs`)
- App Router: `<NuqsAdapter>` wrapper
- Client components: `<Suspense>` wrapper
