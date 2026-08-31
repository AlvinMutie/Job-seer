# Job Seer Design System & UI Foundation (UX-01 to UX-08)

## Executive Summary
This document specifies the visual identity, design tokens, typography hierarchy, semantic color matrix, reusable UI component standards, responsive guidelines, and accessibility conventions for **Job Seer**.

---

## 1. Visual Identity & Brand Personality

Job Seer communicates:
- **Intelligence**: Clear, explainable score metrics, proactive candidate guidance, and structured data presentation.
- **Professionalism**: Modern dark-slate palette with indigo/purple accents. Avoids sci-fi gimmicks, heavy 3D scenes, or particle blobs.
- **Momentum**: High-contrast typography, decision-first Next Best Action recommendations, and clear CTA affordances that move candidates from CV upload to interview invitations.

---

## 2. Color System & Semantic Tokens

Job Seer uses CSS custom properties defined in `frontend/src/index.css`:

| Category | Token / Variable | Hex Value | Usage |
| -------- | ---------------- | --------- | ----- |
| Brand Primary | `--brand-primary` | `#6366f1` | Primary CTAs, active navigation items, main highlights |
| Brand Primary Hover | `--brand-primary-hover` | `#4f46e5` | Primary button hover state |
| Brand Secondary | `--brand-secondary` | `#a855f7` | Secondary accents, score breakdown bars |
| Brand Cyan | `--brand-cyan` | `#06b6d4` | Informational chips, experience metrics |
| Background App | `--bg-app` | `#0b0f19` | Main application background (Level 1) |
| Surface Glass | `--bg-surface` | `rgba(15, 23, 42, 0.75)` | Content panels & cards (Level 2) |
| Surface Hover | `--bg-surface-hover` | `rgba(30, 41, 59, 0.85)` | Elevated modals & focus areas (Level 3) |
| Text Main | `--text-main` | `#f8fafc` | Primary headings and text |
| Text Muted | `--text-muted` | `#64748b` | Subtitles, metadata, timestamps |
| Semantic Success | `--color-success` | `#10b981` | Matched skills, high scores (≥80%), pass badges |
| Semantic Warning | `--color-warning` | `#f59e0b` | Missing skills, moderate scores (50-79%), recommendations |
| Semantic Error | `--color-error` | `#ef4444` | ATS errors, validation failures, destructive actions |

---

## 3. Surface & Depth Hierarchy Scale (UX-04 to UX-08)

- **Level 1 (Page Surface)**: `#0b0f19` solid slate app background.
- **Level 2 (Content Panels)**: Glass slate containers (`bg-slate-900/75 border border-white/10 rounded-2xl`).
- **Level 3 (Elevated Overlays)**: Modal dialogs, active dropdowns, and toast notifications (`bg-slate-950/95 border border-indigo-500/30 shadow-2xl`).

---

## 4. Navigation & Workflow Grouping (UX-05 to UX-08)

Sidebar and drawer menus organize application tools into 4 core candidate workflow sections:
1. **Overview**: Dashboard Command Center & Next Best Action Proactive Banner
2. **Discover**: Jobs Discovery Hub, V2 Explainable Matches
3. **Manage**: Application Tracker (Kanban / List), Resume Intelligence Studio
4. **Account**: Candidate Profile & Career Preferences

---

## 5. Typography Hierarchy

- **Font Family**: `Outfit` sans-serif (Google Fonts).
- **Display Headings**: `text-5xl` to `text-7xl`, `font-black`, `tracking-tight`.
- **Page Headings**: `text-2xl` to `text-3xl`, `font-extrabold`, `text-white`.
- **Card Headings**: `text-lg` to `text-xl`, `font-bold`, `text-white`.
- **Body Text**: `text-sm` to `text-base`, `text-slate-300`, `leading-relaxed`.
- **Metadata & Labels**: `text-xs`, `font-semibold` / `font-mono`, `text-slate-400`.

---

## 6. Component Foundation (`frontend/src/components/ui/`)

1. **`Button.jsx`**: Variants (`primary`, `secondary`, `ghost`, `destructive`, `success`, `outline`), sizes (`sm`, `md`, `lg`), loading spinner state (`isLoading`), and keyboard focus rings.
2. **`Input.jsx`**: Standardized text input with label, placeholder, error state, helper text, start icon slot, and ARIA attributes.
3. **`Select.jsx`**: Custom styled dropdown select with label, options array, and custom chevron icon.
4. **`Badge.jsx`**: Status badges (`indigo`, `emerald`, `amber`, `rose`, `cyan`, `slate`).
5. **`Card.jsx`**: Standard container card (`glass`, `flat`, `elevated`, `interactive`).
6. **`Modal.jsx`**: Accessible modal overlay supporting ESC key closing, backdrop click closing, and body scroll lock.
7. **`EmptyState.jsx`**: Standardized empty state card with icon, title, description, and action button slot.
8. **`LoadingSkeleton.jsx`**: Skeleton loader (`card`, `table-row`, `line`) for asynchronous feedback.
9. **`PageHeader.jsx`**: Standardized header block with title, subtitle, badge tag, and action slot.
10. **`NextBestAction.jsx`**: Proactive candidate recommendation card evaluating candidate setup state and pipeline progress.

---

## 7. Accessibility & Reduced Motion Conventions

- **Focus Rings**: All interactive controls implement `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`.
- **Reduced Motion**: Bypasses CSS keyframe animations when `@media (prefers-reduced-motion: reduce)` is enabled.
- **Color Independence**: Status information always pairs color badges with explicit text labels (e.g., `Applied`, `Interview`, `Offer`, `Rejected`).
- **Keyboard Traps & Dialogs**: `Modal.jsx` listens for `Escape` events and traps overflow scrolling cleanly.
