# API 사용 가이드

Next.js App Router에 최적화된 Supabase API 사용법을 설명합니다.

## 📚 목차

- [개요](#개요)
- [파일 구조](#파일-구조)
- [사용 시나리오](#사용-시나리오)
- [Recipe API](#recipe-api)
- [Category API](#category-api)
- [Profile API](#profile-api)

---

## 개요

이 프로젝트는 Next.js App Router와 서버 컴포넌트를 적극 활용하는 현대적인 아키텍처를 사용합니다.

### 아키텍처 원칙

1. **서버 우선**: 가능한 한 서버 컴포넌트에서 직접 데이터 페칭
2. **Server Actions**: 모든 mutation은 Server Actions로 처리 + 자동 revalidation
3. **React Query**: 클라이언트 인터랙션이 필요한 경우만 사용

### 파일 구조

```
src/entities/{entity}/
  ├── api/
  │   ├── server.ts        # 순수 CRUD 함수 (서버 컴포넌트용)
  │   ├── actions.ts       # Server Actions (mutation + revalidation)
  │   ├── hooks.ts         # React Query 훅 (클라이언트 인터랙션)
  │   └── index.ts         # 통합 export
  └── model/
      └── types.ts         # 타입 정의
```

---

## 사용 시나리오

### 1️⃣ 서버 컴포넌트에서 데이터 조회

**권장**: 페이지 초기 로딩, SEO가 중요한 경우

```tsx
// app/recipes/page.tsx (서버 컴포넌트)
import { getRecipes } from '@/entities/recipe/api/server';

export default async function RecipesPage() {
  // 서버에서 직접 데이터 페칭
  const recipes = await getRecipes();

  return (
    <div>
      <h1>레시피 목록</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**장점**:

- ✅ 빠른 초기 로딩 (SSR)
- ✅ SEO 최적화
- ✅ 서버에서 인증 처리
- ✅ 민감한 데이터 노출 없음

### 2️⃣ Server Actions로 데이터 변경

**권장**: 폼 제출, 데이터 생성/수정/삭제

```tsx
// components/CreateRecipeForm.tsx ('use client')
'use client';

import { createRecipeAction } from '@/entities/recipe/api/actions';
import { useState } from 'react';

export function CreateRecipeForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        user_id: 'user-id',
        title: formData.get('title') as string,
        description: formData.get('description') as string,
      };

      await createRecipeAction(data);

      // 성공 - 페이지가 자동으로 갱신됨
      alert('레시피가 생성되었습니다!');
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='title' placeholder='레시피 제목' required />
      <textarea name='description' placeholder='설명' />
      <button type='submit' disabled={isLoading}>
        {isLoading ? '생성 중...' : '레시피 만들기'}
      </button>
    </form>
  );
}
```

**장점**:

- ✅ 타입 안전한 클라이언트-서버 통신
- ✅ 자동 revalidation (페이지 갱신)
- ✅ 보안 (서버에서 실행)

### 3️⃣ React Query로 클라이언트 인터랙션

**권장**: 실시간 필터링, 검색, 무한 스크롤, Optimistic Updates

```tsx
// components/RecipeDashboard.tsx ('use client')
'use client';

import {
  useRecipes,
  useCreateRecipe,
  useDeleteRecipe,
} from '@/entities/recipe/api/hooks';
import { useState } from 'react';

export function RecipeDashboard() {
  const [userId, setUserId] = useState<string>();

  // 데이터 조회 - 자동 캐싱 및 갱신
  const { data: recipes, isLoading, error } = useRecipes(userId);

  // Mutation 훅 - Optimistic Updates 포함
  const { mutate: createRecipe } = useCreateRecipe();
  const { mutate: deleteRecipe } = useDeleteRecipe();

  const handleCreate = () => {
    createRecipe({
      user_id: 'user-id',
      title: '새 레시피',
      description: '설명',
    });
    // UI가 즉시 업데이트됨 (Optimistic Update)
  };

  const handleDelete = (id: string) => {
    deleteRecipe(id);
    // UI가 즉시 업데이트됨
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreate}>새 레시피</button>
      <ul>
        {recipes?.map(recipe => (
          <li key={recipe.id}>
            {recipe.title}
            <button onClick={() => handleDelete(recipe.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**장점**:

- ✅ 즉각적인 UI 피드백 (Optimistic Updates)
- ✅ 자동 캐싱 및 갱신
- ✅ 로딩/에러 상태 관리
- ✅ 백그라운드 자동 리페칭

---

## Recipe API

### Server API (서버 컴포넌트용)

```typescript
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '@/entities/recipe/api/server';

// 모든 레시피 조회
const recipes = await getRecipes();

// 특정 유저의 레시피만 조회
const userRecipes = await getRecipes('user-id');

// 단일 레시피 조회
const recipe = await getRecipe('recipe-id');

// 레시피 생성
const newRecipe = await createRecipe({
  user_id: 'user-id',
  title: '김치찌개',
  description: '맛있는 김치찌개',
  cooking_time: 30,
  servings: 2,
  ingredients: [
    { name: '김치', amount: '1/4포기' },
    { name: '돼지고기', amount: '200g' },
  ],
  steps: [
    { step: 1, description: '김치를 썰어주세요' },
    { step: 2, description: '고기와 함께 볶아주세요' },
  ],
});

// 레시피 수정
const updated = await updateRecipe('recipe-id', {
  title: '업데이트된 제목',
});

// 레시피 삭제
await deleteRecipe('recipe-id');
```

### Server Actions (클라이언트 컴포넌트용)

```typescript
import {
  createRecipeAction,
  updateRecipeAction,
  deleteRecipeAction,
} from '@/entities/recipe/api/actions';

// 레시피 생성 (자동 revalidation)
const newRecipe = await createRecipeAction({
  user_id: 'user-id',
  title: '새 레시피',
});

// 레시피 수정 (자동 revalidation)
const updated = await updateRecipeAction('recipe-id', {
  title: '수정된 제목',
});

// 레시피 삭제 (자동 revalidation)
await deleteRecipeAction('recipe-id');
```

### React Query Hooks

```typescript
import {
  useRecipes,
  useRecipe,
  useCreateRecipe,
  useUpdateRecipe,
  useDeleteRecipe,
} from '@/entities/recipe/api/hooks';

// 레시피 목록 조회
const { data, isLoading, error } = useRecipes();
const { data: userRecipes } = useRecipes('user-id');

// 단일 레시피 조회
const { data: recipe } = useRecipe('recipe-id');

// 레시피 생성
const { mutate: createRecipe, isPending } = useCreateRecipe();
createRecipe({ user_id: 'user-id', title: '새 레시피' });

// 레시피 수정
const { mutate: updateRecipe } = useUpdateRecipe();
updateRecipe({ id: 'recipe-id', data: { title: '수정' } });

// 레시피 삭제
const { mutate: deleteRecipe } = useDeleteRecipe();
deleteRecipe('recipe-id');
```

---

## Category API

### Server API

```typescript
import {
  getCategoryOptions,
  getCategoryOption,
  getCategoryGroups,
} from '@/entities/category/api/server';

// 모든 카테고리 조회
const categories = await getCategoryOptions();

// 특정 타입의 카테고리만 조회
const situations = await getCategoryOptions('situation');
const cuisines = await getCategoryOptions('cuisine');
const dishTypes = await getCategoryOptions('dishType');

// 단일 카테고리 조회
const category = await getCategoryOption(1);

// 타입별로 그룹화된 카테고리
const groups = await getCategoryGroups();
// [
//   { type: 'situation', options: [...] },
//   { type: 'cuisine', options: [...] },
//   { type: 'dishType', options: [...] }
// ]
```

### Server Actions

```typescript
import {
  createCategoryOptionAction,
  updateCategoryOptionAction,
  deleteCategoryOptionAction,
} from '@/entities/category/api/actions';

// 카테고리 생성
const newCategory = await createCategoryOptionAction({
  type: 'situation',
  code: 'party',
  name: '파티',
  sort_order: 10,
});

// 카테고리 수정
const updated = await updateCategoryOptionAction(1, {
  name: '수정된 이름',
});

// 카테고리 삭제
await deleteCategoryOptionAction(1);
```

### React Query Hooks

```typescript
import {
  useCategoryOptions,
  useCategoryGroups,
  useCreateCategoryOption,
  useUpdateCategoryOption,
  useDeleteCategoryOption,
} from '@/entities/category/api/hooks';

// 카테고리 조회
const { data: categories } = useCategoryOptions();
const { data: situations } = useCategoryOptions('situation');

// 그룹화된 카테고리
const { data: groups } = useCategoryGroups();

// Mutations
const { mutate: createCategory } = useCreateCategoryOption();
const { mutate: updateCategory } = useUpdateCategoryOption();
const { mutate: deleteCategory } = useDeleteCategoryOption();
```

---

## Profile API

### Server API

```typescript
import {
  getProfile,
  getCurrentProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from '@/entities/user/api/server';

// 특정 유저 프로필 조회
const profile = await getProfile('user-id');

// 현재 로그인한 유저의 프로필
const myProfile = await getCurrentProfile();

// 프로필 생성
const newProfile = await createProfile({
  id: 'user-id', // auth.users의 ID
  nickname: '닉네임',
  image_url: 'https://...',
});

// 프로필 수정
const updated = await updateProfile('user-id', {
  nickname: '새 닉네임',
});

// 프로필 삭제
await deleteProfile('user-id');
```

### Server Actions

```typescript
import {
  createProfileAction,
  updateProfileAction,
  deleteProfileAction,
} from '@/entities/user/api/actions';

// 프로필 생성
const newProfile = await createProfileAction({
  id: 'user-id',
  nickname: '닉네임',
});

// 프로필 수정
const updated = await updateProfileAction('user-id', {
  nickname: '새 닉네임',
});

// 프로필 삭제
await deleteProfileAction('user-id');
```

### React Query Hooks

```typescript
import {
  useProfile,
  useCurrentProfile,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
} from '@/entities/user/api/hooks';

// 프로필 조회
const { data: profile } = useProfile('user-id');

// 현재 유저 프로필
const { data: myProfile } = useCurrentProfile();

// Mutations
const { mutate: createProfile } = useCreateProfile();
const { mutate: updateProfile } = useUpdateProfile();
const { mutate: deleteProfile } = useDeleteProfile();
```

---

## 📊 언제 무엇을 사용?

| 상황               | 사용 방법                   | 이유                     |
| ------------------ | --------------------------- | ------------------------ |
| 페이지 초기 데이터 | 서버 컴포넌트 + `server.ts` | SSR, SEO, 빠른 초기 로딩 |
| 목록 페이지        | 서버 컴포넌트               | 검색엔진 최적화          |
| 상세 페이지        | 서버 컴포넌트               | 동적 메타데이터, SEO     |
| 폼 제출            | Server Actions              | 보안, 자동 revalidation  |
| 실시간 필터/검색   | React Query hooks           | 즉각적인 UX              |
| Optimistic Updates | React Query hooks           | 즉각적인 피드백          |
| 무한 스크롤        | React Query hooks           | 클라이언트 상태 관리     |

---

## 🎯 베스트 프랙티스

### 1. 서버 우선 원칙

대부분의 데이터는 서버 컴포넌트에서 페칭하세요.

```tsx
// ✅ 좋은 예
async function RecipesPage() {
  const recipes = await getRecipes();
  return <RecipeList recipes={recipes} />;
}

// ❌ 나쁜 예 (불필요한 클라이언트 페칭)
('use client');
function RecipesPage() {
  const { data: recipes } = useRecipes();
  return <RecipeList recipes={recipes} />;
}
```

### 2. Server Actions 활용

Mutation은 Server Actions를 사용하세요.

```tsx
// ✅ 좋은 예
'use client';
import { createRecipeAction } from '@/entities/recipe/api/actions';

function CreateButton() {
  const handleClick = async () => {
    await createRecipeAction(data);
    // 자동으로 페이지 갱신
  };
}

// ❌ 나쁜 예 (직접 API 호출)
function CreateButton() {
  const handleClick = async () => {
    await fetch('/api/recipes', { method: 'POST', body: ... });
    // 수동으로 revalidate 필요
  };
}
```

### 3. React Query는 필요시만

클라이언트 인터랙션이 필요한 경우만 React Query를 사용하세요.

```tsx
// ✅ 좋은 예 (필터링, 실시간 업데이트 필요)
'use client';
function RecipeFilters() {
  const [filter, setFilter] = useState('');
  const { data } = useRecipes(filter);
  return <FilteredList data={data} />;
}

// ❌ 나쁜 예 (정적 데이터는 서버에서)
('use client');
function StaticPage() {
  const { data } = useRecipes(); // 불필요
  return <div>{data}</div>;
}
```

---

## 🔧 설정

### React Query Provider

이미 `src/app/layout.tsx`에 설정되어 있습니다:

```tsx
import { QueryProvider } from '@/shared/providers/query-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

### React Query Devtools

개발 환경에서 자동으로 활성화됩니다. 브라우저 우측 하단에 React Query 아이콘이 표시됩니다.

---

## 🐛 에러 처리

모든 API 함수는 일관된 에러 처리를 포함합니다:

```typescript
try {
  const recipe = await getRecipe('id');
} catch (error) {
  // 사용자 친화적인 에러 메시지
  console.error(error.message); // "레시피를 불러오는데 실패했습니다."
}
```

React Query 사용 시:

```typescript
const { data, error, isLoading } = useRecipes();

if (error) {
  return <div>오류: {error.message}</div>;
}
```

---

## 📚 추가 참고

- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [Server Actions 가이드](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
