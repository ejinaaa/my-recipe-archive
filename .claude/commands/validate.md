# 코드 검증

FSD 아키텍처 및 디자인 시스템 준수 여부를 검증합니다.

## 검증 항목

### FSD 아키텍처
- Import 규칙 위반 (하위→상위, 동일 레이어 간)
- Views에 비즈니스 로직 존재

### 디자인 시스템
- Typography: `text-sm` 대신 `text-body-2` 사용 여부
- Colors: `bg-red-500` 대신 `bg-primary-base` 사용 여부
- Icons: lucide-react 외 라이브러리 사용 여부

## 워크플로우

### 1단계: 대상 파일 수집

```
/validate              # 전체 src/
/validate src/features # 특정 폴더
```

### 2단계: 검증 실행

각 파일을 읽고 위반 사항 검출

### 3단계: 결과 보고

```
## 검증 결과

### FSD 아키텍처
❌ src/features/search/ui/SearchBar.tsx:5
   → widgets에서 import (하위→상위 위반)

### 디자인 시스템
❌ src/shared/ui/card.tsx:12
   → text-sm 사용 (text-body-2로 변경 필요)

### 요약
- 위반: 2건
```

### 4단계: 자동 수정

수정 가능한 항목에 대해 자동 수정 제안
