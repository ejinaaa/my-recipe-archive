---
description: State management patterns
globs: '**/model/**/*.ts,**/ui/**/*.tsx'
---

# State Management Patterns

## Core Principles

### 1. Minimize State Scope

Manage state in the narrowest possible scope. Unnecessarily broad state increases complexity and causes unpredictable bugs.

```
Local state → Shared between components → Global state → URL state
(narrow)                                                  (broad)
```

### 2. State Location Depends on Purpose

| Question | If Yes → |
|------|-------|
| Should the same screen appear when sharing URL? | URL state |
| Should it be restorable via browser history? | URL state |
| Accessed simultaneously by multiple components? | Global state |
| Used only in a single component? | Local state |

### 3. Separate State from UI (SRP)

Components focus on **UI rendering** only; dependencies on state sources (URL, Store) are injected externally.

```typescript
// BAD: Component knows about state source
function Component() {
  const data = useGlobalStore();  // Tight coupling to global state
}

// GOOD: Component only knows props
function Component({ data, onChange }) {
  // Works regardless of state source
}
```

## State Type Guide

### URL State

**When to use:**
- Search / filter / sort / pagination
- Deep-linking to a specific state
- Users need back button to restore previous state

**Design principles:**
- Omit defaults from URL (clean URL)
- Type-safe parsing (`nuqs` recommended)
- Abstract into hooks to hide URL structure from consumers

### Local State

**When to use:**
- Modal/drawer open state
- Temporary form values (before submission)
- Animation/transition state
- Hover/focus and other pure UI states

**Design principles:**
- Shares lifecycle with component
- Review if lifting to parent is truly needed

### Global State

**When to use:**
- Auth info (login status, user data)
- App settings (theme, language)
- Cross-cutting concerns

**Design principles:**
- Global state is a **last resort**
- If replaceable with URL, use URL
- Server state managed via React Query

## Component Design Patterns

> See `component-creation.md` for Controlled Component pattern and draft state pattern

## Anti-Patterns

### 1. Excessive Global State

```typescript
// BAD: Everything in global state
const useStore = create((set) => ({
  isModalOpen: false,      // Should be local
  searchQuery: '',         // Should be URL
  currentPage: 1,          // Should be URL
}));
```

### 2. Globalizing to Avoid Prop Drilling

```typescript
// BAD: Globalizing because 2-3 level passing is tedious
// GOOD: Component composition, Context, or structural redesign
```

### 3. Mixing State Sources

```typescript
// BAD: Same data duplicated in URL and Store
const [urlQuery] = useQueryState('q');
const { query } = useStore();  // Which is the source of truth?
```

## Migration Guide

When moving global state → URL state:

1. Verify the state is suitable for URL (sharing/history needs)
2. Create URL hook and define parsers
3. Refactor components to pure UI
4. Use URL hook in page and connect via props
5. Remove the state from existing store
