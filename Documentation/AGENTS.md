# AGENTS.md — AI Engineering Guidelines & Operational Constraints

Welcome AI Agent. This document governs all automated and assisted code modifications for the **Smart Job Hunter** codebase. You MUST adhere strictly to these instructions.

---

## 1. Mandatory Development Workflow

Every AI agent working on this codebase MUST follow this explicit 10-step lifecycle. AI agents must **NEVER independently make large architectural changes or execute code modifications without prior approval**.

```text
UNDERSTAND ➔ PLAN ➔ SHOW PLAN ➔ APPROVAL ➔ IMPLEMENT ➔ TEST ➔ SECURITY REVIEW ➔ VERIFY ➔ DOCUMENT ➔ REPORT
```

---

## 2. Fundamental Implementation Rules

### Rule 1 — Inspect Before Editing
Always inspect the relevant implementation using file viewing and code search tools before modifying it. Never infer function signatures, variable names, or file paths without viewing authoritative source files.

### Rule 2 — Minimal Scope
Only modify files strictly required for the approved task. Keep diffs clean and focused.

### Rule 3 — No Opportunistic Refactoring
Do not refactor, reformat, or rewrite unrelated code while implementing a task. Unrequested code churn is unacceptable.

### Rule 4 — No Unapproved Architecture Changes
Do not introduce new frameworks, services, databases, third-party libraries, microservices, or architectural patterns without explicit user approval.

### Rule 5 — Preserve Existing Behavior
Unless the task explicitly specifies a change in behavior, preserve existing API contracts, database schemas, and user-facing functionality.

### Rule 6 — Tests Are Part of Implementation
A task is NOT complete until its required automated tests pass. Writing code without running build/test verification is incomplete.

### Rule 7 — Security Is a Requirement
Review security implications for every backend, database, file-handling, and API change. Validate all user inputs and enforce security boundaries.

### Rule 8 — Verify, Don't Assume
Do not claim that a feature or fix works unless it has been empirically verified by executing verification commands or test scripts.

### Rule 9 — Do Not Hide Failures
If tests fail, commands timeout, dependencies conflict, or an assumption is wrong, report it immediately and transparently.

### Rule 10 — Stop at Scope Boundary
When the approved task is complete, stop execution instead of continuing into unrelated follow-up work.

---

## 3. Proposal Requirements for Multi-File Tasks

Before executing complex tasks affecting multiple files or architectural layers, an AI agent MUST explicitly explain:
- **What was found** (Empirical facts from code inspection)
- **What is intended to change** (Target files and specific code chunks)
- **Why** (Technical justification and problem solved)
- **Files affected** (Explicit absolute paths)
- **Risks & Mitigation** (Potential side effects)
- **Testing Approach** (How verification will be empirically demonstrated)
