---
description: Storybook 스토리 작성 원칙 (CSF 3.0)
globs: '**/*.stories.tsx'
---

# Storybook 스토리 작성 원칙 (CSF 3.0)

## 기본 구조

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentName } from './ComponentName';

const meta = {
  title: '[layer]/[segment]/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  args: { /* 기본 args */ },
  argTypes: { /* control 설정 */ },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

## 스토리 분리 원칙

### Control로 처리 (별도 스토리 X)

`variant`, `size`, `colorScheme`, `disabled` 등 간단한 props:

```typescript
argTypes: {
  variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
  disabled: { control: 'boolean' },
}

export const Default: Story = {};  // 하나의 스토리에서 모든 조합 테스트
```

### 별도 스토리로 분리

- 복잡한 children 조합
- 데이터 edge case (긴 텍스트, 이미지 없음 등)
- Loading / Error / Empty 상태 (Widget)

## 컴포넌트 유형별 필수 스토리

| 유형 | Default | 추가 스토리 |
|------|---------|------------|
| UI Primitive | argTypes control 설정 | 복잡한 children |
| Entity | mock 데이터 사용 | edge case |
| Feature | fn() 액션 핸들러 | 특수 상태 |
| Widget | 기본 데이터 | Loading, Error, Empty |
| View | 기본 데이터 | 주요 상태 |

## Title 네이밍

```typescript
title: 'shared/Button'
title: 'entities/recipe/RecipeCard'
title: 'features/recipe-search/SearchBar'
title: 'widgets/recipe-list/RecipeList'
title: 'views/recipe-detail/RecipeDetailView'
```
