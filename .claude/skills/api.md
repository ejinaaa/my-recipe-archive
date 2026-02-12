---
description: Entity API 생성 — 새로운 Entity의 API 파일들(server.ts, client.ts, actions.ts, hooks.ts, keys.ts, model/types.ts, model/utils.ts)을 자동 생성할 때 사용
---

# Entity API 생성

새로운 Entity의 API 파일들을 자동 생성합니다.

## 사용법

```
/api [entity-name] [table-name?]
```

예시:
```
/api comment
/api bookmark bookmarks
```

## 워크플로우

### 1단계: 정보 확인

사용자에게 질문:
- Entity 이름 (예: comment, bookmark)
- Supabase 테이블 이름 (기본: entity 복수형)
- 필요한 CRUD 작업 선택

### 2단계: model 파일 생성

**`src/entities/[entity]/model/types.ts`** - 타입 정의:

```typescript
export interface [Entity]DB {
  id: string;
  created_at: Date;
  updated_at: Date;
  // 필드 정의
}

export interface [Entity] extends [Entity]DB {}

export type [Entity]Insert = Omit<[Entity]DB, 'id' | 'created_at' | 'updated_at'>;
export type [Entity]Update = Partial<[Entity]Insert>;
```

**`src/entities/[entity]/model/utils.ts`** - 변환 함수:

```typescript
import type { [Entity], [Entity]DB } from './types';

export const to[Entity] = (row: [Entity]DB): [Entity] => ({
  ...row,
});
```

### 3단계: API 파일 생성

**server.ts** - 서버 컴포넌트용 CRUD:
```typescript
import { createClient } from '@/shared/api/supabase/server';
// get[Entity]sApi, get[Entity]Api, create[Entity]Api, update[Entity]Api, delete[Entity]Api
```

**Route API** - 읽기 엔드포인트:
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

**client.ts** - Route API 호출 함수:
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

**actions.ts** - Server Actions (mutation 전용):
```typescript
'use server';
import { revalidatePath } from 'next/cache';
// create[Entity]Action, update[Entity]Action, delete[Entity]Action
// 읽기 action은 생성하지 않음 (Route API 사용)
```

**hooks.ts** - React Query hooks:
```typescript
'use client';
import { fetchXxx } from './client';
import { xxxKeys } from './keys';
// queryFn에 client.ts 함수 사용
// Optimistic Update 포함
```

**index.ts** - 통합 export

### 4단계: 검증

```bash
pnpm build
```

타입 에러 확인 및 수정
