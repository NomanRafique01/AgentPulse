---
name: theme-system
description: >-
  Visual design theme architect and palette generator. Implements or adapts distinctive visual themes (Obsidian, Paper, Blueprint, Technical Monospace) using CSS custom properties, ensuring high contrast, clean dark/light switching, and consistent surface hierarchy. Use when applying or creating design themes. Triggers: $theme-system, theme:, 'apply theme', 'design theme'.
metadata:
  category: frontend
---
# Theme System

**ANNOUNCE:** "Reading `theme-system` — applying a visual theme to this artifact."

A theme is a complete, consistent visual identity. Not just colours — the full token system.

---

## Pre-Set Themes

| ID | Name | Character | Ground | Ink | Accent | Type |
|---|---|---|---|---|---|---|
| T1 | Obsidian | Dark, sharp, technical | #0A0A0A | #F0F0F0 | #00FF87 | JetBrains Mono + Inter |
| T2 | Paper | Light, warm, editorial | #F7F3EE | #1A1A1A | #C85A2A | Playfair Display + Lato |
| T3 | Blueprint | Structured, precise | #0D1B2A | #E8EEF4 | #4A9EFF | Space Grotesk |
| T4 | Studio | Neutral, professional | #FAFAFA | #111111 | #6B4FBB | Neue Haas Grotesk |
| T5 | Terminal | Hacker, monospace | #0C0C0C | #33FF33 | #FF6B35 | Fira Code |
| T6 | Clay | Earthy, tactile | #EDE8DF | #2C2416 | #7B5E3A | Freight Display + Freight Sans |
| T7 | Ice | Cool, clean, modern | #F0F4F8 | #1E2A3A | #0066CC | SF Pro / system-ui |
| T8 | Graphite | Subtle, understated | #1C1C1E | #E5E5E7 | #FF9F0A | San Francisco |
| T9 | Signal | Bold, high contrast | #FFFFFF | #000000 | #FF0040 | GT America + Times |
| T10 | Forest | Calm, focused | #1B2B1B | #D4E8C2 | #7EC850 | Merriweather + Source Sans |

---

## How to Apply a Theme

1. User selects a theme ID (or describes what they want)
2. Output the CSS custom properties:

```css
:root {
  --color-ground: [ground];
  --color-ink: [ink];
  --color-accent: [accent];
  --color-ink-secondary: [ink at 60% opacity];
  --color-surface: [ground lightened 4%];
  --font-display: [display font], sans-serif;
  --font-body: [body font], sans-serif;
  --font-mono: [mono font], monospace;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --space-unit: 8px;
}
```

3. Apply to all elements consistently — no one-off colour values

---

## Custom Theme Generation

When a user wants a custom theme, ask:
1. What is the mood? (3 adjectives)
2. What is the primary use? (screen / print / both)
3. Any existing brand colours to anchor from?

Then generate a complete token system following the same structure as pre-set themes.

