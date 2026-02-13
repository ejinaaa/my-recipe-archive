# Code Style Cleanup

> See `rules/code-style.md` for conventions

## Usage

```
/style                     # Recently changed files
/style src/features/search  # Specific folder
/style --all                # Entire project (src/)
```

## Workflow

### Step 1: Collect Target Files

| Argument | Target |
|------|------|
| (none) | `git diff --name-only HEAD` recently changed `.ts`, `.tsx` |
| path | `.ts`, `.tsx` files in that path |
| `--all` | All `.ts`, `.tsx` in `src/` |

### Step 2: Validation Items

| Item | Validation |
|------|----------|
| Type Import | Whether `import type` or `{ type ... }` is used |
| Naming | Components(PascalCase), hooks(use~Query/Mutation), API(~Api/fetch~/~Action) |
| Function Declaration | Hooks/components → `function`, utils → `const` arrow |
| TypeScript | Props → `interface`, unions/utilities → `type` |
| File Structure | Import order, type/constant/function placement |
| Comments | Whether written in Korean |

### Step 3: Auto-Fix

Automatically fix violations; ask user for confirmation if fix is unclear

### Step 4: Run ESLint

```bash
pnpm lint
```

Fix and re-run if lint errors occur

### Step 5: Report Results

```
## Style Cleanup Results

### Fixes
1. [file:line] - [violation] → [fix description]

### Summary
- Files checked: N
- Fixes: N
- lint: ✅ Passed / ❌ Failed
```
