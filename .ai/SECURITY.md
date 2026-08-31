# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Matching Engine V2 Security & Numerical Safety (P3-02)

`POST /match` enforces strict input sanitization, text normalization, and numerical safety guarantees:

1. **Numerical Bounds & NaN/Inf Protection**: All factor scores (skills, content, experience, role title) and final match percentage are explicitly checked for finite floats (`isinstance(val, float)`, `not math.isnan(val)`, `not math.isinf(val)`). Invalid values fall back to `0.0`.
2. **Zero Code Execution**: Resume text and job description inputs are sanitized by spaCy/regex tokenizers. HTML tags (`<script>`), special characters (`!@#$%`), and SQL syntax are treated purely as inert text. No `eval` or dynamic code evaluation occurs.
3. **Empty Input Safety**: Empty or whitespace-only inputs return `0.0` match percentage cleanly without raising unhandled exceptions or leaking server internals.
