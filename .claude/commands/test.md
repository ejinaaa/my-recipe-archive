# Run Tests and Fix Errors

Run tests and automatically fix failing tests.

> See `rules/testing.md` for test conventions, `skills/test.md` for generation workflow

## Usage

```
/test              # Run all tests
/test [file-path]  # Run specific file only
```

## Workflow

### Step 1: Run Tests

```bash
pnpm vitest run              # All
pnpm vitest run [file-path]  # Specific file
```

### Step 2: Analyze and Fix Failures

On failure:

1. Parse error messages (assertion failure, type error, import error, etc.)
2. **If test is wrong** → fix the test
3. **If source code is wrong** → fix the source
4. Ask user for confirmation if judgment is unclear

### Step 3: Re-run

Run tests again after fixing

### Step 4: Report Results

```
## Test Results

### Fixed Errors
1. [file:line] - [error] → [fix description]

### Final Status
✅ All passed / ❌ N failed
```

## Repeat

Repeat steps 2–4 until all tests pass
