---
description: Test generation — Use when auto-generating Vitest test files for functions and hooks. Supports TDD workflow.
---

# Test Generation

Analyze target code and generate Vitest test files.

## Usage

```
/test [file path or function name]
```

Examples:

```
/test src/entities/recipe/model/utils.ts
/test toggleCategoryFilter
```

## Mode Selection

| Condition | Mode |
|------|------|
| Adding tests to existing code | **Mode A** (Add Tests) |
| User mentions "TDD" | **Mode B** (TDD) |
| Writing new function/hook from scratch | **Mode B** (TDD) |

---

## Mode A: Add Tests to Existing Code

### Step 1: Analyze Target

Read and analyze the target file:

- Function/hook signatures (input/output types)
- Branch conditions (`if`, ternary, `switch`)
- Edge cases (empty array, null/undefined, boundary values)
- External dependencies (React Query, URL state, etc.)

### Step 2: Determine Test Type

| Target | Test Type | Required Tools |
|------|-----------|----------|
| Pure functions (`model/utils.ts`, `shared/lib/`) | Unit test | Vitest |
| React Query hooks (`api/hooks.ts`) | Hook test | Vitest + `@testing-library/react` |
| URL state hooks (`useUrlQueryParams`) | Hook test | Vitest + `nuqs/adapters/testing` |
| UI component interaction | **Storybook play function** | Redirect to `/story` workflow |

### Step 3: Check Mock Data

1. Check if `entities/{entity}/model/mock.ts` exists
2. Add to `mock.ts` if needed mock is missing
3. Add `mockXxxDB` naming for DB-level mocks

### Step 4: Design Test Cases

For each function/hook:

- **Normal cases**: Representative input → expected output
- **Edge cases**: Empty values, null, boundary values, long strings
- **Error cases**: Invalid input, failure scenarios

Organize test case list first, then confirm with user.

### Step 5: Generate Test File

Create co-located `*.test.ts` file:

```typescript
import { describe, expect, it } from 'vitest';
import { targetFunction } from './utils';
import { mockData } from './mock';

describe('targetFunction', () => {
  it('정상 동작을 설명한다', () => {
    // Arrange - Act - Assert
  });
});
```

### Step 6: Run and Verify

```bash
pnpm vitest run [file-path]
```

Analyze and fix any failing tests.

---

## Mode B: TDD (Write New Code)

### Step 1: Analyze Requirements

Derive test cases from user requirements:

- Decide function/hook name and signature
- Define input/output types
- List normal/edge/error cases
- Confirm test cases with user

### Step 2: Red — Write Failing Tests

1. Create **empty function stub** in source file (types only)
2. Write **first test case** in `*.test.ts`
3. Run test to confirm failure

```typescript
// utils.ts — empty stub
export const formatCookingTime = (minutes: number): string => {
  throw new Error('Not implemented');
};

// utils.test.ts — failing test
it('60분 미만이면 분 단위로 표시한다', () => {
  expect(formatCookingTime(30)).toBe('30분');
});
```

### Step 3: Green — Minimal Implementation

Write **minimal** code to pass the test:

- Hard-coding is allowed (next test forces generalization)
- No excessive abstraction

### Step 4: Refactor

While tests are passing:

- Remove duplicate code
- Improve readability
- Improve naming

### Step 5: Repeat

Repeat steps 2–4 for the next test case:

- Add only one test case at a time
- Run tests each cycle to confirm passing
- Run all tests when all cases are complete

---

## Cautions

- Guide to install `@testing-library/react` before hook tests if not installed
- Guide to configure `vitest.config.ts` before running if not set up
- Redirect to Storybook play function for UI component test requests
- Maintain project code style in test files (type-only imports, etc.)
