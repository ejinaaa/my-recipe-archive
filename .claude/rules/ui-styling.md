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
