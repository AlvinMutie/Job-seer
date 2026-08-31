# Job Seer Design System & UI Foundation (UX-01)

## Executive Summary
This document specifies the visual identity, design tokens, typography hierarchy, semantic color matrix, reusable UI component standards, responsive guidelines, and accessibility conventions for **Job Seer**.

---

## 1. Visual Identity & Brand Personality

Job Seer communicates:
- **Intelligence**: Clear, explainable score metrics and structured data presentation.
- **Professionalism**: Modern dark-slate palette with indigo/purple accents. Avoids sci-fi gimmicks, heavy 3D scenes, or particle blobs.
- **Momentum**: High-contrast typography and clear CTA affordances that move candidates from CV upload to interview invitations.

---

## 2. Color System & Semantic Tokens

Job Seer uses CSS custom properties defined in `frontend/src/index.css`:

| Category | Token / Variable | Hex Value | Usage |
| -------- | ---------------- | --------- | ----- |
| Brand Primary | `--brand-primary` | `#6366f1` | Primary CTAs, active navigation items, main highlights |
| Brand Primary Hover | `--brand-primary-hover` | `#4f46e5` | Primary button hover state |
| Brand Secondary | `--brand-secondary` | `#a855f7` | Secondary accents, score breakdown bars |
| Brand Cyan | `--brand-cyan` | `#06b6d4` | Informational chips, experience metrics |
| Background App | `--bg-app` | `#0b0f19` | Main application background |
| Surface Glass | `--bg-surface` | `rgba(15, 23, 42, 0.75)` | Glassmorphic card backgrounds |
| Surface Hover | `--bg-surface-hover` | `rgba(30, 41, 59, 0.85)` | Card hover & elevated elements |
| Text Main | `--text-main` | `#f8fafc` | Primary headings and text |
| Text Muted | `--text-muted` | `#64748b` | Subtitles, metadata, timestamps |
| Semantic Success | `--color-success` | `#10b981` | Matched skills, high scores (≥80%), pass badges |
| Semantic Warning | `--color-warning` | `#f59e0b` | Missing skills, moderate scores (50-79%), recommendations |
| Semantic Error | `--color-error` | `#ef4444` | ATS errors, validation failures, destructive actions |

---

## 3. Typography Hierarchy

- **Font Family**: `Outfit` sans-serif (Google Fonts).
- **Display Headings**: `text-5xl` to `text-7xl`, `font-black`, `tracking-tight`.
- **Page Headings**: `text-2xl` to `text-3xl`, `font-extrabold`, `text-white`.
- **Card Headings**: `text-lg` to `text-xl`, `font-bold`, `text-white`.
- **Body Text**: `text-sm` to `text-base`, `text-slate-300`, `leading-relaxed`.
- **Metadata & Labels**: `text-xs`, `font-semibold` / `font-mono`, `text-slate-400`.

---

## 4. Component Foundation (`frontend/src/components/ui/`)

1. **`Button.jsx`**: Variants (`primary`, `secondary`, `ghost`, `destructive`, `success`, `outline`), sizes (`sm`, `md`, `lg`), loading spinner state (`isLoading`), and keyboard focus rings.
2. **`Input.jsx`**: Standardized text input with label, placeholder, error state, helper text, start icon slot, and ARIA attributes.
3. **`Select.jsx`**: Custom styled dropdown select with label, options array, and custom chevron icon.
4. **`Badge.jsx`**: Status badges (`indigo`, `emerald`, `amber`, `rose`, `cyan`, `slate`).
5. **`Card.jsx`**: Standard container card (`glass`, `flat`, `elevated`, `interactive`).
6. **`Modal.jsx`**: Accessible modal overlay supporting ESC key closing, backdrop click closing, and body scroll lock.
7. **`EmptyState.jsx`**: Standardized empty state card with icon, title, description, and action button slot.
8. **`LoadingSkeleton.jsx`**: Skeleton loader (`card`, `table-row`, `line`) for asynchronous feedback.
9. **`PageHeader.jsx`**: Standardized header block with title, subtitle, badge tag, and action slot.

---

## 5. Accessibility Conventions

- **Focus Rings**: All interactive controls implement `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`.
- **Keyboard Traps & Dialogs**: `Modal.jsx` listens for `Escape` events and traps overflow scrolling cleanly.
- **Form Association**: `Input.jsx` and `Select.jsx` automatically connect `<label htmlFor>` with `<input id>`.
