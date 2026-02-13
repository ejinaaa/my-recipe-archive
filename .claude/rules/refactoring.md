---
description: Refactoring principles
---

# Refactoring Principles

## Core Philosophy

### Purpose of Refactoring

Refactoring is improving **internal structure** while **preserving external behavior**. Purposeless refactoring is dangerous.

**Valid refactoring motivations:**

- Adding new features is difficult (extensibility)
- Fixing bugs causes other bugs (maintainability)
- Understanding code takes too long (readability)
- Same change needed in multiple places (DRY)

## SRP (Single Responsibility Principle)

### Component Responsibility Separation

Design components to have **one reason to change**.

**Separation signals:**

- 150+ lines
- Features described with "and" ("shows filters **and** manages URL")
- Code that changes for different reasons coexists

**Responsibility separation direction:**

```
UI rendering ← Component's sole responsibility
State management → Hook or parent component
Business logic → Separate function/hook
Side effects → Hook
```

### Function Responsibility Separation

- Consider splitting at 20+ lines
- Function name should fully describe its role
- "does X and Y" → candidate for splitting

## DRY (Don't Repeat Yourself)

### Component Consolidation

**Signals for consolidation:**

- 90%+ code duplication
- Components created via copy-paste
- Nearly identical structures with different names

**Consolidation strategy:**

1. Common parts become default behavior
2. Extract differences as optional props
3. Branch with conditional rendering

```typescript
// Abstract differences as props
interface Props {
  onPrimary: () => void;      // Common
  onSecondary?: () => void;   // Optional feature
  variant?: 'strict' | 'flexible';  // Behavior branching
}
```

### Logic Extraction

**Extraction criteria:**

- Logic repeated 2+ times
- State patterns used across multiple components
- Complex calculation/transform logic

**Extraction targets:**

| Logic Type | Extract To |
|----------|----------|
| State + side effects | Custom hook |
| Pure calculation/transform | Utility function |
| Type definitions | `model/types.ts` |

## Dependency Inversion (DIP)

When a component is tightly coupled to concrete implementations (store, router), replace with props.

> See `component-creation.md` Anti-Pattern #1 for specific patterns

## FSD Layer Movement

| Movement Condition | From → To |
|----------|-----------|
| Utility used in 2+ places | Component → `shared/lib/` |
| Complex state management added | features → widgets |
| Types used across multiple files | Component → `model/types.ts` |
| Business entity representation | features → entities |

## Refactoring Safety Checks

### Before

- Understand and document existing behavior
- Verify tests pass (if any)
- Identify impact scope (trace imports)

### After

- Verify build success
- Confirm existing features work
- Clean up deleted exports
- Verify Storybook works correctly

### Incremental Refactoring

Don't change too much at once. Break into small units:

1. Change one concern only
2. Verify build/tests
3. Commit
4. Move to next change
