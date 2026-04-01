---
name: code-review
description: Use when reviewing changes. On-demand quality snapshot as peer reviewer (critical and constructive).
---
# Code Review Skill

```yaml
triggers: ["Review my changes", "Code review", "Audit implementation", "Pr review"]
position: On-demand quality snapshot — peer reviewer (critical & constructive)
```

## Step 1: Isolate the Diff

```bash
BASE=$(git merge-base origin/develop HEAD)
git diff --name-only $BASE..HEAD  # Scope
git diff $BASE..HEAD              # Full diff
```

## Step 2: Quality Gates (Evidence First)

```bash
make lint && make test && make test-integration
# IF failures: Stop. Fix gates before reviewing logic.
```

## Senior Developer Review Checklist

| Area | Checks |
|------|--------|
| **Plan Alignment** | All scenarios implemented · No scope creep · Matches approved approach |
| **Elegance** | YAGNI (no unused code) · KISS (simplest solution) · No premature abstractions · Clear naming · Comments explain "why" |
| **Architecture** | Follows AGENTS.md patterns · No layer violations · Dependencies injected · Interfaces not over-abstracted |
| **DRY** | No duplicate functions · No copy-paste logic · Utilities in shared location · Constants centralized |
| **Error Handling** | All errors checked · Wrapped with context (`%w`) · No silent failures · Appropriate error types |
| **Edge Cases** | Nil checks on pointers · Empty slice/map handling · Zero value handling · Boundary conditions tested · Timeouts on external calls |
| **Test Quality** | Tests for each scenario · Table-driven · `TestType_Method_Scenario` naming · Meaningful assertions · Edge case tests · Minimal mocks |
| **Performance** | No N+1 queries · No unbounded loops · No goroutine leaks · No unnecessary copies |
| **Security** | No secrets in code/logs · Input validation · Parameterized queries · Safe type assertions |
| **Code Smells** | No god functions (>50 lines) · No long param lists (>4) · No magic numbers · No deep nesting (>3) · No dead code |

## Adversarial Review Matrix

| Category | Attack Vector |
|----------|---------------|
| **Plan** | Code for scenarios not in the plan? |
| **Security** | `fmt.Sprintf` into SQL/HTML? Hardcoded tokens? |
| **Concurrency** | Shared `map` access? Goroutines without `WaitGroup`? |
| **Performance** | DB/Network calls inside loops? Unbuffered channels? |
| **Errors** | `_ = func()`? Error returned without wrapping? |
| **Naming** | Vague names: `data`, `info`, `manager`, `handle`? |

## Output Format

```markdown
# Code Review: {Branch Name}
## 1. Summary — Verdict: LGTM / Minor Fixes / Critical Issues
## 2. Quality Gates — lint ✓/✗ · test ✓/✗ · integration ✓/✗
## 3. Findings
### 🔴 Critical — `file.go:42`: Issue description
### 🟡 Improvement — `file.go:15`: Description
### 🟢 Commendation — `file.go`: Clean X
## 4. Recommendation — Merge / Fix then merge / Major refactor
```

## Verification

- [ ] Diff isolated via merge-base
- [ ] Quality gates verified
- [ ] Full checklist reviewed
- [ ] Findings cited with `file:line`
- [ ] Verdict clearly stated

```yaml
exit_when:
  - Diff isolated and quality gates verified
  - Findings cited with file:line evidence
  - Verdict stated with recommendation
```

## Success Metrics
- Every changed file has at least one review comment (even if commendation)
- Findings include `file:line` citations (not vague references)
- Findings categorized by severity (🔴 Critical / 🟡 Improvement / 🟢 Commendation)
- Verdict is one of three options (not ambiguous)
- Architecture violations from AGENTS.md patterns explicitly checked

## Failure Modes
- **Rubber-stamp review:** "LGTM" without examining each file
- **Style-only review:** Checking naming/formatting but missing logic errors
- **Architecture blindness:** Not checking import boundaries or pattern violations
- **Missing adversarial pass:** Skipping the adversarial review matrix entirely
- **Vague findings:** "This could be improved" without `file:line` or specific fix
