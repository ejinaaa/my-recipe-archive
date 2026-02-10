---
description: UI 스타일링 및 디자인 시스템 규칙
globs: '**/*.tsx'
---

# UI 스타일링 규칙

## Typography

```typescript
// ✅ tailwind.config.ts의 커스텀 클래스 사용
<h1 className="text-heading-1">제목</h1>      // 24px Bold
<h2 className="text-heading-2">섹션 제목</h2>  // 20px Bold
<h3 className="text-heading-3">카드 제목</h3>  // 18px SemiBold
<p className="text-body-1">본문</p>           // 16px Regular
<p className="text-body-2">설명</p>           // 14px Regular
<span className="text-caption">작은 텍스트</span> // 12px Regular

// ❌ 임의의 크기 사용 금지
<h1 className="text-2xl font-bold">제목</h1>
```

## Colors

```typescript
// ✅ 정의된 컬러 사용
<button className="bg-primary-base">버튼</button>     // #FF8762
<div className="bg-secondary-base">배경</div>         // #B9DA99
<p className="text-text-primary">주요 텍스트</p>      // #33312F
<span className="text-text-secondary">보조 텍스트</span> // #666666

// ❌ 임의의 색상 사용 금지
<button className="bg-red-500">버튼</button>
```

## Icons

```typescript
// ✅ lucide-react 아이콘만 사용
import { Search, Heart, User } from 'lucide-react';

<Search className="size-4" />  // 16px
<Heart className="size-5" />   // 20px
<User className="size-6" />    // 24px

// ❌ 다른 아이콘 라이브러리 사용 금지
```

## 공통 컴포넌트

```typescript
// ✅ shared/ui 컴포넌트 우선 사용
import { Button } from '@/shared/ui/button';
import { InputGroup } from '@/shared/ui/input-group';
import { Badge } from '@/shared/ui/badge';

// ❌ 공통 컴포넌트가 있는데 직접 스타일링 금지
```

## Section Compound 패턴

섹션 UI는 `Section` + `SectionHeader`를 조합하여 구성한다.

```typescript
import { Section, SectionHeader } from '@/shared/ui/section';

// ✅ 기본 섹션
<Section>
  <SectionHeader title='섹션 제목' />
  {/* 콘텐츠 */}
</Section>

// ✅ 더보기 버튼이 있는 섹션
<Section>
  <SectionHeader title='섹션 제목' moreHref={ROUTES.SEARCH_RESULTS} />
  {/* 콘텐츠 */}
</Section>

// ✅ 큰 제목 (text-heading-2)
<SectionHeader title='섹션 제목' size='lg' />

// ✅ Skeleton/로딩 시 — disabled로 더보기 버튼 비활성화
<SectionHeader title='섹션 제목' moreHref={href} disabled />

// ❌ 인라인 <section> + <h2> 직접 작성 금지
```

## 가로 스크롤

가로 스크롤이 필요한 곳에서는 `HorizontalScroll`을 사용한다. Section 안팎 어디서든 사용 가능.

```typescript
import { HorizontalScroll } from '@/shared/ui/horizontal-scroll';

// ✅ HorizontalScroll 사용
<HorizontalScroll className='gap-3 px-4'>
  {items.map(item => <Card key={item.id} />)}
</HorizontalScroll>

// ❌ overflow-x-auto + scrollbar 숨김 직접 작성 금지
```

## 폼 필드

폼 필드 구성은 `Field` + `FieldLabel`을 조합하여 구성한다.

```typescript
import { Field, FieldLabel, FieldDescription, FieldError } from '@/shared/ui/field';

// ✅ 기본 폼 필드
<Field>
  <FieldLabel>요리 소개</FieldLabel>
  <Input placeholder='내용을 입력해주세요' />
</Field>

// ✅ 필수 필드
<Field>
  <FieldLabel required>요리 이름</FieldLabel>
  <Input placeholder='맛있는 요리 이름을 알려주세요' />
</Field>

// ✅ gap 오버라이드 (기본 gap-2)
<Field className='gap-3'>
  <FieldLabel required>필요한 재료</FieldLabel>
  {/* 콘텐츠 */}
</Field>

// ✅ 설명/에러 메시지
<FieldDescription>최대 50자까지 입력할 수 있어요</FieldDescription>
<FieldError>요리 이름을 입력해주세요</FieldError>

// ❌ 인라인 <section> + <Label> + <span>*</span> 직접 작성 금지
```
