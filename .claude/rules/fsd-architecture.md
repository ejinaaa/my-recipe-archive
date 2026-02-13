---
description: FSD (Feature-Sliced Design) architecture rules
alwaysApply: true
---

# FSD Architecture Rules

## Layer Structure (lower → upper)

```text
src/
├── shared/      # 1. Reusable UI, utilities
├── entities/    # 2. Business entities (Recipe, User, etc.)
├── features/    # 3. User features/scenarios
├── widgets/     # 4. Independent UI blocks
└── views/       # 5. Pages (composition only)
```

## Import Rules

```typescript
// ✅ Upper can import from lower
import { RecipeCard } from '@/entities/recipe';
import { Button } from '@/shared/ui/button';

// ❌ Lower cannot import from upper
// No importing widgets from features

// ❌ No same-layer cross-imports
// No importing features/user-auth from features/recipe-search
```

## Layer Placement Criteria

| Layer | Criteria |
|-------|----------|
| **Widgets** | Own state management, complex logic (infinite scroll, data fetching), combines multiple entities/features |
| **Features** | Specific user scenario, single-purpose functionality, reusable across pages |
| **Views** | Page-level routes, composition of other layers only, no logic |

## Cross-import Resolution Between Same Layer

When a component is shared across different slices in the same layer:

| Situation | Solution |
|-----------|----------|
| Used by multiple slices | Move to `shared` + generalize domain-specific naming/interface |
| Reused only within same slice | Keep in that slice |

```typescript
// ❌ entities/favorite/ui/FavoriteButton → cannot import from entities/recipe (cross-import)

// ✅ Move to shared/ui/favorite-button + domain-agnostic interface
// isFavorite, onToggle — generic prop naming

// ✅ Used only within entities/recipe/ui/ → keep in that slice
// RecipeThumbnailImage, CookingTimeBadge, ServingsBadge
```

## Folder Structure Pattern

```text
feature-name/
├── ui/              # UI components
│   ├── Component.tsx
│   └── Component.stories.tsx
├── model/           # Types, utilities, constants
│   ├── types.ts
│   ├── utils.ts
│   └── constants.ts
├── api/             # API calls (entities only)
│   ├── server.ts
│   ├── client.ts
│   ├── actions.ts
│   ├── hooks.ts
│   └── keys.ts
└── index.ts         # Public exports
```
