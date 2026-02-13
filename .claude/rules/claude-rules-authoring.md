---
description: Claude rules/skills/commands authoring guidelines
globs: '.claude/**/*.md'
---

# Claude Rules/Skills/Commands Authoring Guidelines

## File Type Selection

| Type | Purpose | Trigger |
|------|------|--------|
| Rule (`rules/`) | Coding conventions, pattern guides | Auto on globs match or alwaysApply |
| Skill (`skills/`) | Multi-step workflows (creation, refactoring) | Auto-detected on description match |
| Command (`commands/`) | Simple execution tasks (build, test, validate) | Explicit `/command` invocation |

## Token Cost Priority

`alwaysApply` rule > frequent globs rule (`*.tsx`) > narrow globs rule (`*.test.ts`) > skill/command (on-demand)

**Principle**: Higher cost → shorter content. Target under 100 lines for `alwaysApply` rules.

## Writing Principles

### Conciseness

- **Tables > code blocks**: Use tables for mappings/comparisons
- **Bullets > prose**: Use short bullet points for explanations
- **No counter-examples**: Show only correct patterns (counter-examples waste tokens)
- **Minimize code blocks**: One code example per pattern, explain variations in tables
- **No duplication**: Cross-reference with `> See rule-name.md for ~` when content exists in another rule

### Structure

- Frontmatter: `description` (1-line summary), `globs` or `alwaysApply`
- Core patterns/rules first, examples minimal
- Cross-reference between related rules to prevent duplication

### Skill/Command Specifics

- Skill: Include trigger keywords in `description` (what requests it should match)
- Command: Minimize content by referencing other rules/skills (`> See rules/xxx.md for conventions`)
