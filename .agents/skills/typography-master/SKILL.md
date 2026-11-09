---
name: typography-master
description: >-
  Domain-tailored typographic scale and font archetype selector. Selects domain font archetypes (Swiss Neutral, High Editorial, Monospace Terminal, Humanist Sans) and calculates mathematical fluid clamp scales with calibrated tracking and measure. Use when setting up fonts, type scales, and reading rhythm. Triggers: $typography, type:, 'typography master', 'font archetype'.
metadata:
  category: frontend
---
# Typography Master

**ANNOUNCE:** "Reading `typography-master` — establishing domain-tailored type hierarchy and font selection."

**Core Axiom:** Typography is 90% of web design. When typography is decided deliberately, the interface needs almost no other decoration.

---

## 1. Domain-Tailored Font Archetypes

Never default to generic Inter or Roboto unless building a neutral system utility. Choose the font archetype that embodies the subject's world:

### Archetype A: The Technical Swiss (Precision, Engineering, Tools)
- **Vibe:** Systematic, objective, zero ornament, razor-sharp metrics.
- **Top Families:** Geist, Neue Haas Grotesk, PP Neue Montreal, Telegraf.
- **System Stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui`.
- **Display Tracking:** `-0.03em` to `-0.05em`.
- **Best For:** Developer tools, infrastructure consoles, compilers, scientific software.

### Archetype B: The Editorial Broadside (Culture, Journalism, In-Depth Essays)
- **Vibe:** Literary, authoritative, high-contrast stroke modulation.
- **Top Families:** Newsreader, Instrument Serif, Fraunces, GT Super, Source Serif 4.
- **Display Tracking:** `-0.02em` with generous leading (`1.0` to `1.15`).
- **Best For:** Longform publications, research labs, architectural studios, luxury retail.

### Archetype C: The Industrial Monospace (Terminal, Cryptography, Raw Data)
- **Vibe:** Mechanical, predictable tabular rhythm, brutalist utility.
- **Top Families:** JetBrains Mono, Berkeley Mono, Commit Mono, IBM Plex Mono.
- **Rule:** Monospace belongs on code, data matrices, and ledger numbers — NEVER on marketing subheadings.
- **Best For:** Financial trading terminals, blockchain tools, IDEs, log viewers.

### Archetype D: The Warm Humanist (Healthcare, Education, Hospitality)
- **Vibe:** Approachable, organic terminal curves, open apertures.
- **Top Families:** Plus Jakarta Sans, General Sans, Literata, Recoleta.
- **Best For:** Mental health apps, culinary platforms, boutique hotels, community hubs.

---

## 2. Typographic Scale & Mathematical Ratios

Pick **one** modular scale and stick to it across the entire project:

| Scale Ratio | Factor | Character | Best For |
|---|---|---|---|
| **Minor Third** | `1.200` | Compact, dense | Complex dashboards, data tables |
| **Major Third** | `1.250` | Balanced, classic | Standard SaaS applications, web apps |
| **Perfect Fourth**| `1.333` | Confident contrast | Landing pages, marketing sites |
| **Augmented 4th** | `1.414` | Dramatic, bold | Event sites, portfolios, campaigns |

### Fluid Clamp Tokens Formula
```css
:root {
  /* Fluid type scale formula: clamp(min, preferred, max) */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 0.9375rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-lg: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --text-xl: clamp(1.75rem, 1.5rem + 1vw, 2.25rem);
  --text-2xl: clamp(2.25rem, 1.85rem + 1.8vw, 3.25rem);
  --text-display: clamp(3rem, 2.2rem + 3.5vw, 5.5rem);
}
```

---

## 3. The Laws of Metric Tuning

1. **The Tracking Law (Optical Compensation):**
   - As font size increases, tracking **must decrease**.
   - Headlines (`32px+`): `letter-spacing: -0.02em` to `-0.05em`.
   - Body (`16px-18px`): `letter-spacing: 0` to `-0.01em`.
   - Small labels (`11px-13px`): `letter-spacing: +0.01em` to `+0.03em`.

2. **The Leading Law:**
   - Display headlines: `line-height: 0.9` to `1.1` (tight, connected).
   - Body copy: `line-height: 1.45` to `1.6` (generous breathing room).
   - Line length (measure): 45 to 75 characters per line (`max-w-prose` or `max-w-xl`).

3. **Tabular Numerals for Data:**
   Any table, counter, clock, or aligned column **must** enable tabular figures:
   ```css
   font-variant-numeric: tabular-nums;
   ```

---

## 4. Pairing Rules

- **Maximum 2 Families:** 1 display/heading family + 1 body family (or 1 family with optical weights).
- **Never pair two close sans-serifs:** Pairing Helvetica with Inter looks like an accident.
- **Match X-Height:** If pairing a serif heading with a sans-serif body, ensure their optical x-heights align.
- **Contrast is required:** If pairing, contrast in classification (Serif + Sans, Sans + Mono, Geometric + Humanist).

