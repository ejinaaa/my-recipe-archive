# Build and Fix Errors

Build the project and automatically fix errors.

## Workflow

### Step 1: Run Build

```bash
pnpm build
```

### Step 2: Analyze and Fix Errors

On error:
1. Parse error messages
2. Navigate to the file and fix
3. Ask user for confirmation if fix is unclear

### Step 3: Rebuild

Run build again after fixing errors

### Step 4: Report Results

```
## Build Results

### Fixed Errors
1. [file:line] - [error] → [fix description]

### Final Status
✅ Build successful / ❌ Build failed
```

## Repeat

Repeat steps 2–4 until build succeeds
