# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
pnpm dev          # Dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm storybook    # Storybook (port 6006)
```

## Architecture (FSD - Feature-Sliced Design)

Layer hierarchy (lower → upper): `shared → entities → features → widgets → views`

**Import rules:**
- Upper layers can import from lower layers
- Lower layers cannot import from upper layers
- No cross-import between same-layer slices

```
src/
├── shared/      # Reusable UI, utilities, API clients
├── entities/    # Business entities (recipe, user, category)
├── features/    # User features (recipe-search)
├── widgets/     # Complex UI blocks (recipe-list, bottom-navigation)
├── views/       # Page composition (no business logic)
└── app/         # Next.js App Router pages
```

## Data Fetching Patterns

| Pattern | File | Purpose |
|---------|------|---------|
| Server API | `entities/{entity}/api/server.ts` | SSR prefetch, Route API internals |
| Route API | `app/api/**/route.ts` | Client data reads |
| Client Fetch | `entities/{entity}/api/client.ts` | Route API calls (hooks queryFn) |
| Server Actions | `entities/{entity}/api/actions.ts` | Mutation + revalidation (write-only) |
| React Query Hooks | `entities/{entity}/api/hooks.ts` | Client state management |
| Query Keys | `entities/{entity}/api/keys.ts` | React Query key factory |

## Design System

**Typography** (defined in tailwind.config.ts):
- `text-heading-1` (24px Bold), `text-heading-2` (20px Bold), `text-heading-3` (18px SemiBold)
- `text-body-1` (16px), `text-body-2` (14px), `text-caption` (12px)

**Colors:**
- Primary: `primary-base` (#FF8762), Secondary: `secondary-base` (#B9DA99)
- Text: `text-primary` (#33312F), `text-secondary` (#666666)

**Icons:** lucide-react only

## Shared Component Creation

When a needed component doesn't exist in `shared/ui/*`:

1. Generate base component via shadcn/ui:
   ```bash
   pnpm dlx shadcn@latest add [component-name]
   ```
2. Apply project design system:
   - Typography → custom classes (`text-heading-1`, `text-body-1`, etc.)
   - Colors → project palette (`primary-base`, `text-primary`, etc.)

## Key Conventions

- Path alias: `@/*` → `./src/*`
- Views layer: composition only, no business logic
- Entity structure: `api/` (server.ts, client.ts, actions.ts, hooks.ts, keys.ts), `model/` (types.ts, utils.ts, constants.ts), `ui/`
- Reuse existing project code whenever possible before writing new components/logic
- Maintain project tone and existing style patterns when developing new screens/UI

## Communication

- All responses and questions in Korean (한국어)
