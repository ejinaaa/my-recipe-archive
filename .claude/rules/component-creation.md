---
description: Component creation principles
globs: '**/shared/ui/**/*.tsx,**/entities/**/ui/**/*.tsx,**/features/**/ui/**/*.tsx,**/widgets/**/ui/**/*.tsx'
---

# Component Design Principles

## Design Philosophy

### 1. Composability

Components should be composable like Lego blocks. Small, focused components are better than large monolithic ones.

### 2. Predictability

Same props → same result. No implicit dependency on external state.

### 3. Reusability

Components tightly coupled to specific contexts are hard to reuse. Design with generality in mind.

## Pre-Creation Checklist

1. **Check existing components**: Is there a similar component in `shared/ui/`?
2. **Determine layer**: Which FSD layer should this component belong to?
3. **Scope of responsibility**: Does it have one clear responsibility?

## Design Principles by Layer

| Layer | Responsibility | Dependencies |
|-------|---------------|-------------|
| shared | Generic UI primitives | None (pure) |
| entities | Business entity representation | shared only |
| features | User interaction | shared, entities |
| widgets | Composite UI blocks | shared, entities, features |
| views | Page composition | All lower layers |

### shared/ui

- **No business logic**: Pure UI only
- **Maximum flexibility**: Usable in various contexts
- shadcn/ui base + project design system applied

#### shadcn/ui Customization Procedure

1. Install with `pnpm dlx shadcn@latest add [name]`
2. Review generated code (default styles, structure)
3. Apply project design system (typography: `text-body-2` etc., color: `text-text-primary` etc.)
4. Add custom props if needed (e.g., `required`)
5. Write stories

### features/widgets

- **Controlled Component**: State controlled via props
- **Dependency Injection**: No direct dependency on external state sources
- **Callback Pattern**: Delegate results to parent

## Controlled Component Pattern

Design principles for components with complex interactions (modals, drawers, forms).

### Why Controlled?

| Uncontrolled | Controlled |
|--------------|------------|
| Internal state management | State injected externally |
| Mocking needed for testing | Testable with props alone |
| Tightly coupled to one state source | Connectable to various state sources |

### Props Design Pattern

```typescript
interface ControlledComponentProps {
  // 1. Control props - open/close state
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // 2. Data props - optional + defaults
  initialValue?: T;
  defaultValue?: T;

  // 3. Event callbacks - deliver results
  onApply: (value: T) => void;
  onCancel?: () => void;

  // 4. Variant props - behavior branching
  variant?: 'default' | 'compact';
  disabled?: boolean;
}
```

### Draft State Management

When users preview changes before "Apply":

```typescript
function Editor({ open, initialValue, onApply }) {
  // Draft state during editing
  const [draft, setDraft] = useState(initialValue);

  // Reset to initial value on each open
  useEffect(() => {
    if (open) setDraft(initialValue);
  }, [open, initialValue]);

  // Only propagate externally on apply
  const handleApply = () => {
    onApply(draft);
    onOpenChange(false);
  };
}
```

## Designing for Extensibility

### Supporting Variants via Optional Props

```typescript
// Core functionality required, extensions optional
interface Props {
  onPrimary: () => void;       // Always required
  onSecondary?: () => void;    // Shows additional button if provided
  requireValidation?: boolean; // Enables validation logic when true
}
```

### Default Value Strategy

- Use the most common use case as default
- Defaults make usage sites more concise
- Distinguish `undefined` vs `null` semantics (when needed)

## Anti-Patterns

### 1. Direct Dependency on External State

```typescript
// BAD
function Component() {
  const data = useGlobalStore();  // Tight coupling
}

// GOOD
function Component({ data }) {
  // Independent of state source
}
```

### 2. Excessive Props

10+ props → consider splitting component or grouping into objects

### 3. Excessive Conditional Rendering

3+ branches → consider splitting into separate components

## Required Deliverables

- `[ComponentName].tsx` - Component
- `[ComponentName].stories.tsx` - Story
- `index.ts` - Public API export
