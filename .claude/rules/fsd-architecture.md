---
description: FSD (Feature-Sliced Design) 아키텍처 규칙
alwaysApply: true
---

# FSD 아키텍처 규칙

## 레이어 구조 (하위 → 상위)

```
src/
├── shared/      # 1. 재사용 가능한 UI, 유틸리티
├── entities/    # 2. 비즈니스 엔티티 (Recipe, User 등)
├── features/    # 3. 사용자 기능/시나리오
├── widgets/     # 4. 독립적인 UI 블록
└── views/       # 5. 페이지 (조합만 담당)
```

## Import 규칙

```typescript
// ✅ 상위는 하위를 import 가능
import { RecipeCard } from '@/entities/recipe';
import { Button } from '@/shared/ui/button';

// ❌ 하위는 상위를 import 불가
// features에서 widgets import 금지

// ❌ 같은 레이어 간 import 금지
// features/recipe-search에서 features/user-auth import 금지
```

## 레이어 배치 기준

| 레이어 | 배치 기준 |
|--------|----------|
| **Widgets** | 자체 상태 관리, 복잡한 로직 (infinite scroll, data fetching), 여러 entities/features 조합 |
| **Features** | 특정 사용자 시나리오, 단일 목적 기능, 여러 페이지에서 재사용 |
| **Views** | 페이지 레벨 라우트, 다른 레이어들의 조합만, 로직 포함 금지 |

## 폴더 구조 패턴

```
feature-name/
├── ui/              # UI 컴포넌트
│   ├── Component.tsx
│   └── Component.stories.tsx
├── model/           # 타입, 상태, 비즈니스 로직
│   ├── types.ts
│   └── hooks.ts
├── api/             # API 호출
│   ├── server.ts    # 서버 컴포넌트용
│   ├── actions.ts   # Server Actions
│   └── hooks.ts     # React Query hooks
└── index.ts         # Public exports
```
