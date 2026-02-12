---
description: Claude rules/skills/commands 작성 가이드라인
globs: '.claude/**/*.md'
---

# Claude Rules/Skills/Commands 작성 가이드라인

## 파일 유형 선택

| 유형 | 용도 | 트리거 |
|------|------|--------|
| Rule (`rules/`) | 코딩 컨벤션, 패턴 가이드 | globs 매칭 또는 alwaysApply 시 자동 |
| Skill (`skills/`) | 멀티스텝 워크플로우 (생성, 리팩터링) | description 매칭 시 자동 감지 |
| Command (`commands/`) | 단순 실행 작업 (빌드, 테스트, 검증) | `/command` 명시 호출 |

## 토큰 비용 우선순위

`alwaysApply` rule > 빈번한 globs rule (`*.tsx`) > 좁은 globs rule (`*.test.ts`) > skill/command (on-demand)

**원칙**: 비용이 높을수록 더 짧게 작성. `alwaysApply` rule은 100줄 이내 목표.

## 작성 원칙

### 간결성

- **테이블 > 코드블록**: 매핑/비교는 테이블로
- **불릿 > 산문**: 설명은 짧은 불릿 포인트로
- **❌ 반례 금지**: ✅ 올바른 패턴만 제시 (반례는 토큰만 소모)
- **코드블록 최소화**: 패턴 1개당 코드 예시 1개, 변형은 테이블로 차이만 설명
- **중복 금지**: 다른 rule에 이미 있는 내용은 `> ~는 rule-name.md 참고`로 교차 참조

### 구조

- Frontmatter: `description` (1줄 요약), `globs` 또는 `alwaysApply`
- 핵심 패턴/규칙을 먼저, 예시는 최소한으로
- 관련 규칙 간 교차 참조로 중복 방지

### Skill/Command 특화

- Skill: `description`에 트리거 키워드 포함 (어떤 요청에 매칭될지)
- Command: 다른 rule/skill 참조로 내용 최소화 (`> 컨벤션은 rules/xxx.md 참고`)
