---
description: Refactoring workflow — Use when analyzing and refactoring code (component splitting, consolidation, pure UI conversion, layer movement, etc.)
---

# Refactoring Workflow

Analyze user-specified code and perform refactoring.

## Workflow

### Step 1: Analysis

Read the target code and analyze:

- Current code structure
- Component/function size (line count)
- Responsibility separation status
- Code duplication
- FSD layer appropriateness
- **State management location appropriateness** (URL/local/global)
- **Similar component consolidation potential**

### Step 2: Report Issues

Organize and report discovered issues:

```
## Analysis Results

### Current State
- File: [file path]
- Size: [line count]
- Layer: [current layer]

### Discovered Issues
1. [Issue 1]: [description]
2. [Issue 2]: [description]
...
```

### Step 3: Propose Refactoring

Present specific refactoring proposals:

```
## Refactoring Proposals

### Option 1: [proposal name]
- Changes: [description]
- Expected result: [description]

### Option 2: [proposal name]
- Changes: [description]
- Expected result: [description]
```

**Common refactoring types:**

| Type | Description | Related Skill |
|------|------|----------|
| Component splitting | 150+ lines, responsibility separation | - |
| Component consolidation | 90%+ duplicate similar components | - |
| Pure UI conversion | Separate external dependencies (URL/store) | - |
| URL state migration | Zustand → URL query parameters | `/url-state` |
| Layer movement | Movement between FSD layers | - |

### Step 4: User Confirmation

Confirm with user which option to proceed with.

### Step 5: Implementation

Perform refactoring according to the approved option:

1. Split/modify code
2. Place files according to FSD structure
3. Update import paths
4. Clean up index.ts exports
5. Verify compatibility with existing code

**When consolidating components:**
- Extract common props
- Optional features as optional props
- Behavior branching via boolean/enum props

**When converting to pure UI:**
- initialValue props (optional + defaults)
- onApply callback props
- Internal local draft state only
- useEffect to sync initial value on open

### Step 6: Verify

After refactoring:

1. Run `pnpm build` to verify build
2. Fix any errors
3. Check for import errors from deleted files
4. Report summary of changes

## Cautions

- Preserve existing functionality
- Don't make too many changes at once
- Get user confirmation at each step
- Follow FSD architecture rules
- Maintain project code style
- **Delete story files for deleted components**
