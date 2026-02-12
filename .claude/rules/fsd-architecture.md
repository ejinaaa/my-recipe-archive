---
description: FSD (Feature-Sliced Design) 아키텍처 규칙
alwaysApply: true
---

# FSD 아키텍처 규칙

## 레이어 구조 (하위 → 상위)

```text
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
| -------- | ---------- |
| **Widgets** | 자체 상태 관리, 복잡한 로직 (infinite scroll, data fetching), 여러 entities/features 조합 |
| **Features** | 특정 사용자 시나리오, 단일 목적 기능, 여러 페이지에서 재사용 |
| **Views** | 페이지 레벨 라우트, 다른 레이어들의 조합만, 로직 포함 금지 |

## 같은 레이어 간 Cross-import 해결 패턴

같은 레이어의 다른 슬라이스에서 공통으로 사용하는 컴포넌트가 있을 때:

| 상황 | 해결 방법 |
| ------ | ---------- |
| 여러 슬라이스에서 사용 | `shared`로 이동 + 도메인 특화 네이밍/인터페이스를 범용화 |
| 같은 슬라이스 내부에서만 재사용 | 해당 슬라이스에 유지 |

```typescript
// ❌ entities/favorite/ui/FavoriteButton → entities/recipe에서 import 불가 (cross-import)

// ✅ shared/ui/favorite-button으로 이동 + 도메인 무관한 인터페이스
// isFavorite, onToggle — 범용적인 prop 네이밍

// ✅ entities/recipe/ui/ 내부에서만 사용 → 해당 슬라이스에 유지
// RecipeThumbnailImage, CookingTimeBadge, ServingsBadge
```

## 폴더 구조 패턴

```text
feature-name/
├── ui/              # UI 컴포넌트
│   ├── Component.tsx
│   └── Component.stories.tsx
├── model/           # 타입, 유틸리티, 상수
│   ├── types.ts     # 타입/인터페이스 정의
│   ├── utils.ts     # 변환/유틸리티 함수
│   └── constants.ts # 상수 정의
├── api/             # API 호출 (entities만 해당)
│   ├── server.ts    # Supabase 직접 접근 (서버 전용)
│   ├── client.ts    # Route API fetch 함수
│   ├── actions.ts   # Server Actions (mutation 전용)
│   ├── hooks.ts     # React Query hooks
│   └── keys.ts      # Query keys factory
└── index.ts         # Public exports
```
