# AGENTS.md — AI Engineering Guidelines & Operational Constraints

Welcome AI Agent. This document governs all automated and assisted code modifications for the **Smart Job Hunter** codebase. You MUST adhere strictly to these instructions.

---

## 1. Mandatory Development Workflow

Every AI agent working on this codebase MUST follow this explicit 8-step workflow. AI agents must **NEVER independently make large architectural changes or execute code modifications without prior approval**.

```text
  1. ANALYSE        -> Inspect authoritative source files; gather empirical facts.
  2. PLAN           -> Formulate a detailed, modular implementation plan with risk assessment.
  3. APPROVE        -> Present plan to user; wait for explicit confirmation.
  4. IMPLEMENT      -> Execute targeted, minimal code modifications.
  5. TEST           -> Run automated tests and linting to verify runtime correctness.
  6. SECURITY REVIEW-> Verify security boundaries, input validation, and access control.
  7. DOCUMENT       -> Update .ai/ and docs/ documentation system reflecting changes.
  8. REPORT         -> Present concise, technical completion summary to user.
```

---

## 2. Core Engineering Principles

1. **Inspect Before Modifying**:
   - Never assume file locations, schema attributes, or API signatures.
   - Always view source files completely before attempting code edits.
   - Do not trust `README.md` or obsolete documentation; treat existing application source code as the sole source of truth.

2. **Security-First Development**:
   - Never commit hardcoded secrets, tokens, or fallback API keys.
   - Ensure all new API endpoints are protected with valid JWT bearer authentication (`get_current_user`).
   - Validate and sanitize all user input and file uploads. Sanitization must be enforced at backend entry points.

3. **Minimal & Targeted Changes**:
   - Keep pull requests and edits focused strictly on requested bug fixes or features.
   - Do not perform unrequested refactoring, format rewrites, or aesthetic overhauls.

4. **No Invented Requirements**:
   - Build only what is specified in approved implementation plans.
   - Do not add speculative dependencies or bloated third-party frameworks.

5. **Empirical Verification Required**:
   - Never declare a task resolved without running build, linting, and automated test commands.
   - Verify both frontend compilation (`npm run build`) and backend syntax/imports before completing a turn.

---

## 3. Proposal Requirements for Complex Tasks

Before executing complex or multi-file tasks, an AI agent MUST explicitly explain:
- **What was found** (Empirical facts from code inspection)
- **What is intended to change** (Target files and specific code chunks)
- **Why** (Technical justification and problem solved)
- **Files affected** (Explicit absolute paths)
- **Risks & Mitigation** (Potential side effects)
- **Testing Approach** (How verification will be empirically demonstrated)
