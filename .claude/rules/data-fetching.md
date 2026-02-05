---
description: 데이터 페칭 패턴
globs: '**/api/**/*.ts'
---

# 데이터 페칭 패턴

## 3가지 패턴

| 상황 | 사용 패턴 | 파일 |
|------|----------|------|
| 페이지 초기 데이터, SEO | Server API | `server.ts` |
| 폼 제출, 데이터 변경 | Server Actions | `actions.ts` |
| 실시간 필터링, 무한 스크롤 | React Query Hooks | `hooks.ts` |

## Server API (server.ts)

```typescript
// 서버 컴포넌트에서 직접 호출
import { getRecipes } from '@/entities/recipe/api/server';

export default async function RecipesPage() {
  const recipes = await getRecipes();
  return <RecipeList recipes={recipes} />;
}
```

## Server Actions (actions.ts)

```typescript
// 'use server' 선언, revalidatePath 포함
'use server';
import { revalidatePath } from 'next/cache';

export async function createRecipeAction(data: RecipeInput) {
  const recipe = await createRecipe(data);
  revalidatePath('/recipes');
  return recipe;
}
```

## React Query Hooks (hooks.ts)

```typescript
// 클라이언트 컴포넌트에서 사용
'use client';
import { useRecipes } from '@/entities/recipe/api/hooks';

function RecipeFilter() {
  const [filter, setFilter] = useState('');
  const { data, isLoading } = useRecipes(filter);
  // ...
}
```

## 원칙

- **서버 우선**: 대부분의 데이터는 서버 컴포넌트에서 페칭
- **Server Actions**: 모든 mutation은 Server Actions로 처리
- **React Query**: 클라이언트 인터랙션이 필요한 경우만 사용
