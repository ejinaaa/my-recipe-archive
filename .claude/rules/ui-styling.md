---
description: UI styling and design system rules
globs: '**/*.tsx'
---

# UI Styling Rules

## Typography

Use only custom classes (arbitrary `text-2xl font-bold` etc. forbidden):

- `text-heading-1` (24px Bold), `text-heading-2` (20px Bold), `text-heading-3` (18px SemiBold)
- `text-body-1` (16px), `text-body-2` (14px), `text-caption` (12px)

## Colors

Use only defined colors (arbitrary `bg-red-500` etc. forbidden):

- Primary: `primary-base` (#FF8762), Secondary: `secondary-base` (#B9DA99)
- Text: `text-text-primary` (#33312F), `text-text-secondary` (#666666)

## Icons

`lucide-react` only (no other icon libraries):

```typescript
import { Search, Heart, User } from 'lucide-react';
<Search className="size-4" />  // 16px
```

## Shared Components

Use `shared/ui` components first (no custom styling when a shared component exists)

## Section Compound Pattern

Use `Section` + `SectionHeader` composition (inline `<section>` + `<h2>` forbidden):

```typescript
import { Section, SectionHeader } from '@/shared/ui/section';

<Section>
  <SectionHeader title='섹션 제목' moreHref={ROUTES.SEARCH_RESULTS} />
  {/* content */}
</Section>
```

- `size='lg'`: Large title (text-heading-2)
- `disabled`: Disable "more" button during skeleton/loading

## Horizontal Scroll

Use `HorizontalScroll` (manual `overflow-x-auto` + scrollbar hiding forbidden):

```typescript
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';

<HorizontalScroll className='gap-3 px-5'>
  {items.map(item => <Card key={item.id} />)}
</HorizontalScroll>
```

## Form Fields

Use `Field` + `FieldLabel` composition (inline `<Label>` + `<span>*</span>` forbidden):

```typescript
import { Field, FieldLabel, FieldDescription, FieldError } from '@/shared/ui/field';

<Field>
  <FieldLabel required>요리 이름</FieldLabel>
  <Input placeholder='맛있는 요리 이름을 알려주세요' />
</Field>
```

- `required`: Shows `*` on label
- `className='gap-3'`: Gap override (default gap-2)
- `FieldDescription`: Help text, `FieldError`: Error message
