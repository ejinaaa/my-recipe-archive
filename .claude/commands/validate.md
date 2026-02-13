# Code Validation

Validate compliance with FSD architecture and design system.

## Validation Items

### FSD Architecture
- Import rule violations (lower→upper, same-layer cross-imports)
- Business logic in Views

### Design System
- Typography: Whether `text-body-2` is used instead of `text-sm`
- Colors: Whether `bg-primary-base` is used instead of `bg-red-500`
- Icons: Whether non-lucide-react libraries are used

## Workflow

### Step 1: Collect Target Files

```
/validate              # Entire src/
/validate src/features # Specific folder
```

### Step 2: Run Validation

Read each file and detect violations

### Step 3: Report Results

```
## Validation Results

### FSD Architecture
❌ src/features/search/ui/SearchBar.tsx:5
   → Import from widgets (lower→upper violation)

### Design System
❌ src/shared/ui/card.tsx:12
   → Uses text-sm (should change to text-body-2)

### Summary
- Violations: 2
```

### Step 4: Auto-Fix

Suggest automatic fixes for fixable items
