---
description: Entity API generation — Use when auto-generating API files (server.ts, client.ts, actions.ts, hooks.ts, keys.ts, model/types.ts, model/utils.ts) for a new Entity
---

# Entity API Generation

Auto-generate API files for a new Entity.

## Usage

```
/api [entity-name] [table-name?]
```

Examples:
```
/api comment
/api bookmark bookmarks
```

## Workflow

### Step 1: Gather Information

Ask user:
- Entity name (e.g., comment, bookmark)
- Supabase table name (default: entity plural form)
- Required CRUD operations

### Step 2: Generate Model Files

**`src/entities/[entity]/model/types.ts`** - Type definitions:

```typescript
export interface [Entity]DB {
  id: string;
  created_at: Date;
  updated_at: Date;
  // field definitions
}

export interface [Entity] extends [Entity]DB {}

export type [Entity]Insert = Omit<[Entity]DB, 'id' | 'created_at' | 'updated_at'>;
export type [Entity]Update = Partial<[Entity]Insert>;
```

**`src/entities/[entity]/model/utils.ts`** - Transform functions:

```typescript
import type { [Entity], [Entity]DB } from './types';

export const to[Entity] = (row: [Entity]DB): [Entity] => ({
  ...row,
});
```

### Step 3: Generate API Files

**server.ts** - Server component CRUD:
```typescript
import { createClient } from '@/shared/api/supabase/server';
// get[Entity]sApi, get[Entity]Api, create[Entity]Api, update[Entity]Api, delete[Entity]Api
```

**Route API** - Read endpoints:
```typescript
// src/app/api/[entities]/route.ts
import { get[Entity]sApi } from '@/entities/[entity]/api/server';

export async function GET(request: NextRequest) {
  const data = await get[Entity]sApi();
  return Response.json(data);
}

// src/app/api/[entities]/[id]/route.ts
export async function GET(request, { params }) {
  const data = await get[Entity]Api(id);
  return Response.json(data);
}
```

**client.ts** - Route API fetch functions:
```typescript
import { getBaseUrl } from '@/shared/api/getBaseUrl';
import { handleApiResponse } from '@/shared/api/fetchWithError';

export const fetch[Entity]s = async (): Promise<[Entity][]> => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/[entities]`);
  return handleApiResponse<[Entity][]>(res, '[entity] 목록을 가져오지 못했어요');
};
```

**keys.ts** - Query keys factory:
```typescript
export const [entity]Keys = {
  all: ['[entities]'] as const,
  lists: () => [...[entity]Keys.all, 'list'] as const,
  details: () => [...[entity]Keys.all, 'detail'] as const,
  detail: (id: string) => [...[entity]Keys.details(), id] as const,
};
```

**actions.ts** - Server Actions (mutation-only):
```typescript
'use server';
import { revalidatePath } from 'next/cache';
// create[Entity]Action, update[Entity]Action, delete[Entity]Action
// No read actions (use Route API instead)
```

**hooks.ts** - React Query hooks:
```typescript
'use client';
import { fetchXxx } from './client';
import { xxxKeys } from './keys';
// Use client.ts functions as queryFn
// Include Optimistic Update
```

**index.ts** - Combined exports

### Step 4: Verify

```bash
pnpm build
```

Check and fix type errors
