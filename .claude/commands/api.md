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

### 2단계: 타입 생성

`src/entities/[entity]/model/types.ts`:

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

### 3단계: API 파일 생성

**server.ts** - 서버 컴포넌트용 CRUD:
```typescript
import { createClient } from '@/shared/lib/supabase/server';
// get[Entity]s, get[Entity], create[Entity], update[Entity], delete[Entity]
```

**actions.ts** - Server Actions + revalidation:
```typescript
'use server';
import { revalidatePath } from 'next/cache';
// [action]Action 함수들
```

**hooks.ts** - React Query hooks:
```typescript
'use client';
// queryKeys, use[Entity]s, use[Entity], usCreate[Entity], useUpdate[Entity], useDelete[Entity]
// Optimistic Update 포함
```

**index.ts** - 통합 export

### 4단계: 검증

```bash
pnpm build
```

타입 에러 확인 및 수정
