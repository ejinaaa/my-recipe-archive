---
description: Component creation — Use when scaffolding a new component (component file + story + index.ts export)
---

# Component Creation

Scaffold a new component.

## Usage

```
/create-component [ComponentName] [layer] [segment?]
```

Examples:
```
/create-component Button shared
/create-component RecipeCard entities recipe
/create-component SearchBar features recipe-search
```

## Workflow

### Step 1: Gather Information

Ask user if input is incomplete:
- Component name (PascalCase)
- Layer (shared/entities/features/widgets/views)
- Segment (for non-shared layers)

### Step 2: Check Existing Components

Check if a similar component exists in `shared/ui/` and notify if found

### Step 3: Generate Files

**For shared/ui:**
```bash
pnpm dlx shadcn@latest add [component-name]
```
→ Apply design system to generated files

**For other layers:**
```
src/[layer]/[segment]/ui/
├── [ComponentName].tsx
├── [ComponentName].stories.tsx
└── index.ts (add export)
```

### Step 4: Generate Story

Run `/story` workflow to generate story file

### Step 5: Set Up Exports

Add export to `index.ts`

### Step 6: Verify

```bash
pnpm build
```

Fix build errors if any
