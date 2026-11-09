---
name: responsive-contract-enforcer
description: >-
  Responsive API and data contract enforcer. Audits backend payloads and database schemas to strictly forbid fixed pixel dimensions, mandating explicit aspect ratios, fluid clamp metadata, and responsive srcset arrays. Use when defining API responses, media schemas, or full-stack models. Triggers: $responsive-contract, responsive-api:, 'responsive contract', 'responsive api contract'.
metadata:
  category: backend
---
# Responsive Contract Enforcer (Backend & API Standard)

**ANNOUNCE:** "Reading `responsive-contract-enforcer` — enforcing backend dynamic UI sizing contracts."

**Core Axiom:** A backend engineer cannot write an API or component contract that assumes a fixed display size. Data models and server-driven payloads must provide responsive metadata to guarantee flawless rendering on phone and desktop.

---

## 1. The Backend API Rules for UI Contracts

### Rule 1: No Hardcoded Dimension Properties in Payloads
APIs must never return fixed pixel coordinates or CSS widths. Use semantic layout tokens:
```json
// ❌ BANNED: Hardcoded pixel dimensions in backend payload
{
  "component": "CardGrid",
  "width": 1200,
  "cardWidth": 380,
  "height": 600
}

// ✅ MANDATORY: Responsive layout hints
{
  "component": "CardGrid",
  "layout": {
    "mobile": "single-stack",
    "tablet": "dual-column",
    "desktop": "auto-fill"
  },
  "minItemWidth": "320px",
  "gap": "var(--space-md)"
}
```

### Rule 2: Media Payloads Must Include Aspect Ratios & SrcSets
To prevent Cumulative Layout Shift (CLS) on the client, every image and video returned by a backend endpoint must include explicit aspect ratios and multi-resolution variants:
```json
{
  "media": {
    "url": "https://cdn.app.com/hero-1440.webp",
    "aspectRatio": "16/9",
    "width": 1440,
    "height": 810,
    "srcset": [
      { "width": 390, "url": "https://cdn.app.com/hero-390.webp" },
      { "width": 768, "url": "https://cdn.app.com/hero-768.webp" },
      { "width": 1440, "url": "https://cdn.app.com/hero-1440.webp" }
    ],
    "blurHash": "L6Pj0^jE.AyE_3t7t7R**0o#DgR4"
  }
}
```

### Rule 3: Paginated & Virtualized Data Contracts for Desktop & Mobile
- Mobile views should support cursor-based infinite stream pagination (`after: "cursor_token"`).
- Desktop views should support indexed page navigation (`page: 1, limit: 50`) for data tables.
- Payloads must include `totalCount` so desktop table headers can display total items accurately.

---

## 2. Full-Stack Pull Request Review Checklist

When reviewing full-stack branches or backend endpoints powering UI:
- [ ] Backend data models provide responsive image dimensions and aspect ratios.
- [ ] No fixed pixel values (`width: 800px`) leaked in server response templates.
- [ ] Frontend implementation verifies compliance with:
  - `phone-layout-master` (iPhone 320px–390px, 100svh, 44px touch targets).
  - `desktop-ui-architect` (Desktop 1440px+, container queries, max bounds).
- [ ] Zero horizontal overflow on mobile viewports.

