---
name: canvas-art
description: >-
  Static visual art, poster, and canvas layout generator. Crafts high-resolution graphics, geometric posters, printable assets, and decorative vector canvas compositions using clean mathematical layout principles. Use for standalone generative art, posters, exportable cards, and graphics. Triggers: $canvas-art, canvas:, 'generate poster', 'canvas art'.
metadata:
  category: frontend
---
# Canvas Art Maker

**ANNOUNCE:** "Reading `canvas-art` — creating an original static design artifact."

Static output. The goal is a visually resolved, printable or shareable artifact.

---

## Process

### 1. Define the Design Philosophy First
Before generating anything, write a short design philosophy (1 paragraph):
- What is this piece communicating?
- What is the visual language (geometric, organic, typographic, photographic)?
- What are the constraints (format, colours, audience)?

Write this to a `.md` file named after the project.

### 2. Token System
Even for static art, define:
```
PALETTE: [4 hex values max — ground, primary, secondary, accent]
TYPE: [typeface + weight + size for headline, body, caption]
GRID: [column count, margins, baseline]
MOTIF: [the repeating visual element, if any]
```

### 3. Build Hierarchy
Static pieces have one dominant element. Everything else is secondary.
- Large: the one thing that should be seen first
- Medium: the supporting context
- Small: the details for those who look closely

### 4. Craft Rules
- No gradients unless they're the explicit concept
- No drop shadows — use layering and contrast instead
- Text never fights with a background image (use contrast scrim or solid section)
- Whitespace is not empty — it is active composition
- Every edge and corner is a decision, not a default

### 5. Output
Export at the resolution appropriate for the use case:
- Screen/social: 2× retina (1920px, 2400px for portrait)
- Print: 300dpi at output size
- PDF: vector whenever possible (text and shapes as vectors, not rasters)

