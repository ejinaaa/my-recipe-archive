---
description: UI 스타일링 및 디자인 시스템 규칙
globs: '**/*.tsx'
---

# UI 스타일링 규칙

## Typography

커스텀 클래스만 사용 (임의의 `text-2xl font-bold` 등 금지):

- `text-heading-1` (24px Bold), `text-heading-2` (20px Bold), `text-heading-3` (18px SemiBold)
- `text-body-1` (16px), `text-body-2` (14px), `text-caption` (12px)

## Colors

정의된 컬러만 사용 (임의의 `bg-red-500` 등 금지):

- Primary: `primary-base` (#FF8762), Secondary: `secondary-base` (#B9DA99)
- Text: `text-text-primary` (#33312F), `text-text-secondary` (#666666)

## Icons

`lucide-react`만 사용 (다른 아이콘 라이브러리 금지):

```typescript
import { Search, Heart, User } from 'lucide-react';
<Search className="size-4" />  // 16px
```

## 공통 컴포넌트

`shared/ui` 컴포넌트 우선 사용 (공통 컴포넌트가 있는데 직접 스타일링 금지)

## Section Compound 패턴

`Section` + `SectionHeader` 조합 (인라인 `<section>` + `<h2>` 직접 작성 금지):

```typescript
import { Section, SectionHeader } from '@/shared/ui/section';

<Section>
  <SectionHeader title='섹션 제목' moreHref={ROUTES.SEARCH_RESULTS} />
  {/* 콘텐츠 */}
</Section>
```

- `size='lg'`: 큰 제목 (text-heading-2)
- `disabled`: Skeleton/로딩 시 더보기 버튼 비활성화

## 가로 스크롤

`HorizontalScroll` 사용 (`overflow-x-auto` + scrollbar 숨김 직접 작성 금지):

```typescript
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';

<HorizontalScroll className='gap-3 px-4'>
  {items.map(item => <Card key={item.id} />)}
</HorizontalScroll>
```

## 폼 필드

`Field` + `FieldLabel` 조합 (인라인 `<Label>` + `<span>*</span>` 직접 작성 금지):

```typescript
import { Field, FieldLabel, FieldDescription, FieldError } from '@/shared/ui/field';

<Field>
  <FieldLabel required>요리 이름</FieldLabel>
  <Input placeholder='맛있는 요리 이름을 알려주세요' />
</Field>
```

- `required`: 라벨에 `*` 표시
- `className='gap-3'`: gap 오버라이드 (기본 gap-2)
- `FieldDescription`: 도움말, `FieldError`: 에러 메시지
