# IMPLEMENTATION_CONTRACT.md — AI Agent Operating & Implementation Contract

## Purpose
This document defines the formal operational rules and implementation contract that all AI coding assistants MUST follow when contributing to **Smart Job Hunter**.

---

## The 10-Step Mandatory Engineering Lifecycle

```text
 1. UNDERSTAND       -> View authoritative source files; inspect exact codebase implementation.
 2. PLAN             -> Draft a precise, small-scoped technical implementation plan.
 3. SHOW PLAN        -> Present the plan to the user in structured markdown.
 4. APPROVAL         -> STOP and wait for explicit user approval before modifying code.
 5. IMPLEMENT        -> Execute targeted, minimal code modifications for approved tasks.
 6. TEST             -> Run unit tests, build commands, and safety gates.
 7. SECURITY REVIEW  -> Verify input validation, security boundaries, and authorization.
 8. VERIFY           -> Confirm runtime functionality with empirical log/command output.
 9. DOCUMENT         -> Update .ai/ and docs/ documentation to match new state.
10. REPORT           -> Give a concise, factual summary of completed work to the user.
```

---

## Scope Boundary & Architectural Rules

1. **No Scope Inflation**: An instruction to "continue", "fix", or "improve" MUST NOT be interpreted as permission to execute broad architectural changes, install packages, or rewrite files.
2. **Multi-File Impact Mandate**: For any task affecting multiple files or architectural layers, the AI agent MUST explicitly specify before editing:
   - Exact files to modify (absolute paths)
   - New files to create (absolute paths)
   - Behavior being changed
   - Behavior being preserved
   - Automated tests being added or updated
   - Security implications & access control impact
3. **No Unrequested Refactoring**: Edits must be strictly limited to code necessary for the approved task. Cleaning up unrelated formatting or rewriting styles is prohibited.
4. **Empirical Evidence First**: Diagnostics and fix confirmations MUST be backed by actual terminal output or log snippets, not assumptions.
