--- Cursor Command: create-component ---

# FSD 컴포넌트 생성 자동화

FSD 아키텍처를 준수하며 새로운 컴포넌트를 생성합니다.

## 1단계: 정보 수집

다음 정보를 AskQuestion 도구로 수집하거나 사용자에게 질문:

1. **컴포넌트 이름**: PascalCase로 (예: RecipeCard, SearchBar)
2. **레이어**: 어느 레이어에 생성할지

   - shared: 재사용 가능한 UI 컴포넌트
   - entities: 비즈니스 엔티티 (recipe, user 등)
   - features: 사용자 기능 (recipe-search 등)
   - widgets: 독립적 UI 블록 (recipe-list 등)
   - views: 페이지 레벨

3. **기능/엔티티 이름**: kebab-case로 (예: recipe-search, bottom-navigation)

   - shared는 기능명 없이 직접 ui/ 아래 생성

4. **타입**: 생성할 파일 타입

   - ui: UI 컴포넌트
   - model: 타입 정의, hooks
   - api: API 호출 함수

5. **Storybook**: Storybook 파일도 생성할지? (ui 타입일 때만)

## 2단계: 폴더 구조 생성

### Shared 레이어

```
src/shared/ui/{component-name}.tsx
src/shared/ui/{component-name}.stories.tsx (선택)
```

### 기타 레이어

```
src/{layer}/{feature-name}/
├── ui/
│   ├── {ComponentName}.tsx
│   └── {ComponentName}.stories.tsx (선택)
├── model/
│   ├── types.ts
│   └── hooks.ts
├── api/
│   ├── actions.ts
│   └── server.ts
└── index.ts
```

## 3단계: 파일 생성

### UI 컴포넌트 템플릿

```typescript
import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface {ComponentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Props 정의
}

const {ComponentName} = React.forwardRef<HTMLDivElement, {ComponentName}Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        {/* 컴포넌트 내용 */}
      </div>
    );
  }
);

{ComponentName}.displayName = '{ComponentName}';

export { {ComponentName} };
```

### Model 타입 템플릿

```typescript
// types.ts
export interface {EntityName} {
  id: string;
  // 필드 정의
}

// hooks.ts
import { useState } from 'react';

export function use{EntityName}() {
  // Hook 로직
}
```

### API 템플릿

```typescript
// actions.ts (Client)
'use server';

export async function get{EntityName}() {
  // Server Action
}

// server.ts (Server)
import { createClient } from '@/shared/api/supabase/server';

export async function get{EntityName}() {
  const supabase = await createClient();
  // API 로직
}
```

## 4단계: index.ts 업데이트

```typescript
// 새 파일 생성
export { {ComponentName} } from './ui/{ComponentName}';
export type { {ComponentName}Props } from './ui/{ComponentName}';

// 기존 파일이 있다면 추가
export { NewComponent } from './ui/NewComponent';
```

## 5단계: Storybook 파일 (선택)

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { {ComponentName} } from './{ComponentName}';

const meta: Meta<typeof {ComponentName}> = {
  title: '{Layer}/{FeatureName}/{ComponentName}',
  component: {ComponentName},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof {ComponentName}>;

export const Default: Story = {
  args: {},
};
```

## 6단계: 확인

- [ ] 올바른 레이어에 생성됐는가?
- [ ] index.ts에서 export 했는가?
- [ ] Props 인터페이스가 정의됐는가?
- [ ] Linter 에러가 없는가?

## 실행 예시

```
사용자: /create-component

AI: 컴포넌트 정보를 알려주세요:
- 이름: FilterButton
- 레이어: features
- 기능명: recipe-search
- 타입: ui
- Storybook: 예

AI: [파일들 생성]
✓ src/features/recipe-search/ui/FilterButton.tsx
✓ src/features/recipe-search/ui/FilterButton.stories.tsx
✓ src/features/recipe-search/index.ts (업데이트)
```

--- End Command ---
